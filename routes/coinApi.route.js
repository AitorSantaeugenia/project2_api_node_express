const express = require('express');
const router = express.Router();

// // Import user
// const User = require('../models/User.model');
// // Import mongoose
// const mongoose = require('mongoose');

// // require bcryptJS
// const bcryptjs = require('bcryptjs');
// // 10 saltrounds
// const saltRounds = 10;

//Import models
const User = require('../models/User.model');
const Crypto = require('../models/Crypto.model');

// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Api = require('../services/ApiHandler');
const coinLoreApi = new Api();

//Need to find better behaviour
//First 100 cryptos /?start=100&limit=100 || This api can't do more
router.get('/cryptocurrency/:start', isLoggedIn, (req, res) => {
	let start = Number(req.params.start);
	if (start === NaN || start <= -101 || start === 'NAN') {
		start = 0;
	}
	start += 100;

	coinLoreApi
		.getAllCoins100(start)
		.then((allCoins100) => {
			res.render(`cryptocurrency/list`, {
				coins: allCoins100.data,
				start,
				userInSession: req.session.currentUser,
				message: req.session.sessionFlash
			});

			//remove req.session if it exists to not show everytime
			if (req.session.sessionFlash) {
				req.session.sessionFlash = [];
			}
		})
		.catch((err) => console.log(err));
});

// ADD cryptocurrency to favorites list
router.post('/add-favorite', isLoggedIn, (req, res) => {
	const query = ({
		name,
		symbol,
		price_usd,
		percent_change_24h,
		percent_change_1h,
		percent_change_7d,
		apiID
	} = req.body);
	const userID = req.session.currentUser._id;
	const idToCheck = query.apiID;

	Crypto.find({ apiID: idToCheck }).then((charArray) => {
		if (charArray.length === 0) {
			Crypto.create(query)
				.then((result) => {
					console.log('Check this', result.id);
					User.findByIdAndUpdate(userID, { $push: { cryptocurrency: result.id } }).then(() => {
						req.session.sessionFlash = {
							type: 'success',
							message: 'Added cryptocurrency to dashboard.'
						};
						res.redirect('/cryptocurrency/-100', 301);
					});
				})
				.catch((err) => console.log(err));
		} else {
			User.findById(userID)
				.then((user) => {
					if (!user.cryptocurrency.includes(charArray[0]._id)) {
						User.findByIdAndUpdate(userID, {
							$push: { cryptocurrency: charArray[0]._id }
						}).then(() => {
							req.session.sessionFlash = {
								type: 'success',
								message: 'Added cryptocurrency to dashboard.'
							};
							res.redirect('/cryptocurrency/-100', 301);
						});
					} else {
						req.session.sessionFlash = {
							type: 'success',
							message: 'Added cryptocurrency to dashboard.'
						};
						res.redirect('/cryptocurrency/-100', 301);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});
});

module.exports = router;
