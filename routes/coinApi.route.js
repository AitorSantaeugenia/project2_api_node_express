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

//First 100 cryptos /?start=100&limit=100 || This api can't do more
router.get('/cryptocurrency/:start', isLoggedIn, (req, res) => {
	let start = Number(req.params.start);
	start += 100;

	//console.log('aitor', req.session.currentUser);
	coinLoreApi
		.getAllCoins100(start)
		.then((allCoins100) => {
			//if allcoins100 > 0
			// allcoins100.isPositive()
			res.render(`cryptocurrency/list`, {
				coins: allCoins100.data,
				// allcoins100 : isPositive
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
	//console.log('User id:', req.session.currentUser._id);
	//console.log('Query:', query.id);
	//res.redirect('/cryptocurrency/list');
	//console.log(idToCheck);

	Crypto.find({ apiID: idToCheck }).then((charArray) => {
		//comprobar si ese apiId ya esta en db cards
		//console.log(idToCheck);
		//console.log('Whoot', charArray);
		//console.log(charArray.length);

		if (charArray.length === 0) {
			Crypto.create(query)
				.then((result) => {
					console.log('Check this', result.id);
					User.findByIdAndUpdate(userID, { $push: { cryptocurrency: result.id } }).then(() => {
						res.redirect('/cryptocurrency/list');
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
							res.redirect('/cryptocurrency/list', 301);
						});
					} else {
						req.session.sessionFlash = {
							type: 'success',
							message: 'Added cryptocurrency to dashboard.'
						};
						res.redirect('/cryptocurrency/list', 301);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});
});

module.exports = router;
