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
// const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Api = require('../services/ApiHandler');
const coinLoreApi = new Api();

//First 100 cryptos /?start=100&limit=100
router.get('/cryptocurrency/:start', (req, res) => {
	let start = Number(req.params.start);
	start += 100;

	coinLoreApi
		.getAllCoins100(start)
		.then((allCoins100) => {
			res.render(`cryptocurrency/list`, { coins: allCoins100.data, start });
			//res.send(allCoins100.data);
			//console.log(allCoins100.data);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
