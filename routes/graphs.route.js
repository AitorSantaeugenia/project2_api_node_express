const express = require('express');
const router = express.Router();
// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

//First 100 cryptos
router.get('/cryptocurrency/:coin/detalle', (req, res) => {
	res.render('cryptocurrency/details');
});

module.exports = router;
