const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
// // Import user
const User = require('../models/User.model');
// Import Crypto
const Crypto = require('../models/Crypto.model');
// Import Crypto
const Comment = require('../models/Comment.model');
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
// DASHBOARD - INDEX - GET
// ---------------------------------------------------------------------------------
router.get('/dashboard', isLoggedIn, (req, res) => {
	//res.render('users/dashboard', { userInSession: req.session.currentUser });

	User.findById(req.session.currentUser._id)
		.populate('cryptocurrency')
		.populate('comments')
		.then((user) => {
			//console.log(user);
			res.render('users/dashboard', {
				userInSession: user,
				message: req.session.sessionFlash
			});

			//remove req.session if it exists to not show everytime
			if (req.session.sessionFlash) {
				req.session.sessionFlash = [];
			}
		})
		.catch((error) => console.log(error));
});
// ---------------------------------------------------------------------------------
// DASHBOARD - ADD COMMENT - GET
// ---------------------------------------------------------------------------------
router.get('/add-comment', isLoggedIn, (req, res) => {
	res.redirect('/dashboard', {
		userInSession: req.session.currentUser
	});
});
// ---------------------------------------------------------------------------------
// DASHBOARD - ADD-COMMENT - POST
// ---------------------------------------------------------------------------------
router.post('/add-comment', isLoggedIn, (req, res) => {
	//res.render('users/dashboard', { userInSession: req.session.currentUser });
	let { comments, idcrypto } = req.body;
	const userID = req.session.currentUser._id;
	const paramsToBD = { comments, user: userID, cryptocurrency: idcrypto };

	//crear comentarios
	//añadir comentario a crypto
	// comprovar usuario logeado, añadir comment a crypto de dicho usuario

	//console.log(paramsToBD);
	Comment.create(paramsToBD)
		.then((result) => {
			//console.log('Check this', result.id);
			User.findByIdAndUpdate(userID, { $push: { comments: result.id } }).then(() => {
				req.session.sessionFlash = {
					type: 'Added',
					message: 'Added comment to the crypto.'
				};
				res.redirect('/dashboard', 301, { userInSession: userID });
			});
		})
		.catch((err) => console.log(err));
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
				type: 'Deleted',
				message: 'Deleted cryptocurrency from dashboard.'
			};
			res.redirect(301, '/dashboard');
			//console.log(req.session.sessionFlash);
		})
		.catch((err) => console.log(err));
});
// ---------------------------------------------------------------------------------
// DELETE - Crypto from favourite
// ---------------------------------------------------------------------------------
router.post('/delete-comment', isLoggedIn, (req, res) => {
	const { id } = req.body;
	//console.log(id);

	Comment.deleteOne({ id })
		.then(() => {
			// res.redirect('/dashboard');
			req.session.sessionFlash = {
				type: 'Deleted',
				message: 'Deleted comment from TODO list.'
			};
			res.redirect(301, '/dashboard');
			//console.log(req.session.sessionFlash);
		})
		.catch((err) => console.log(err));
});
// ---------------------------------------------------------------------------------
// DELETE - Update comment
// ---------------------------------------------------------------------------------
router.post('/update-comment', isLoggedIn, (req, res) => {
	const { id, comments } = req.body;
	console.log(id, comments);

	Comment.updateOne({ _id: id }, { comments: comments })
		.then(() => {
			req.session.sessionFlash = {
				type: 'Updated',
				message: 'Updated comment from TODO list.'
			};
			res.redirect(301, '/dashboard');
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

module.exports = router;
