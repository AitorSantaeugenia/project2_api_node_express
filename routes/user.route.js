const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
// // Import user
const User = require('../models/User.model');
// Import Crypto
const Crypto = require('../models/Crypto.model');
// Import mongoose
const mongoose = require('mongoose');

// // require bcryptJS
// const bcryptjs = require('bcryptjs');
// // 10 saltrounds
// const saltRounds = 10;

// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Api = require('../services/ApiHandler');
const coinLoreApi = new Api();

// ---------------------------------------------------------------------------------
// DASHBOARD - GET
// ---------------------------------------------------------------------------------
router.get('/dashboard', isLoggedIn, (req, res) => {
	//res.render('users/dashboard', { userInSession: req.session.currentUser });

	User.findById(req.session.currentUser._id)
		.populate('cryptocurrency')
		.then((user) => {
			res.render('users/dashboard', { userInSession: user, message: req.session.sessionFlash });

			//remove req.session if it exists to not show everytime
			if (req.session.sessionFlash) {
				req.session.sessionFlash = [];
			}
		})
		.catch((error) => console.log(error));
});

// ---------------------------------------------------------------------------------
// LOGOUT - POST
// ---------------------------------------------------------------------------------
router.post('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if (err) next(err);
		res.redirect('/');
	});
});
// ---------------------------------------------------------------------------------
// DELETE - Crypto from favourite
// ---------------------------------------------------------------------------------
router.post('/delete', isLoggedIn, (req, res) => {
	const { id } = req.body;
	User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { cryptocurrency: id } })
		.then(() => {
			// res.redirect('/dashboard');
			req.session.sessionFlash = {
				type: 'success',
				message: 'Deleted cryptocurrency from dashboard.'
			};
			res.redirect(301, '/dashboard');
			//console.log(req.session.sessionFlash);
		})
		.catch((err) => console.log(err));
});
// ---------------------------------------------------------------------------------
// DEMO - GET
// ---------------------------------------------------------------------------------
router.get('/demo', isLoggedIn, (req, res) => {
	res.render('users/demo', {
		userInSession: req.session.currentUser
	});
});
// ---------------------------------------------------------------------------------
// ADD COMMENT - POST
// ---------------------------------------------------------------------------------
router.get('/add-comment', isLoggedIn, (req, res) => {
	res.redirect('/dashboard', {
		userInSession: req.session.currentUser
	});
});
// ---------------------------------------------------------------------------------
module.exports = router;
