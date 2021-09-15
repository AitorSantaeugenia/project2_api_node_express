const router = require('express').Router();

// Import for middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index', {
		userInSession: req.session.currentUser
	});
});

module.exports = router;
