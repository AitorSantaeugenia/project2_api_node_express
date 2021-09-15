const express = require('express');
const router = express.Router();

//Import models
const User = require('../models/User.model');
const Crypto = require('../models/Crypto.model');

// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

//First 100 cryptos
router.get('/cryptocurrency/coin/detalle', isLoggedIn, (req, res) => {
	res.render('cryptocurrency/details', {
		userInSession: req.session.currentUser
	});
});

module.exports = router;
