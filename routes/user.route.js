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

// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Api = require('../services/ApiHandler');
const coinLoreApi = new Api();

// ---------------------------------------------------------------------------------
// USER PROFILE - GET
// ---------------------------------------------------------------------------------
router.get('/userProfile', isLoggedIn, (req, res) => {
	res.render('users/user-profile', { userInSession: req.session.currentUser });
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

module.exports = router;
