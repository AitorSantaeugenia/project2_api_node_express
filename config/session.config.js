// config/session.config.js

// require session
const session = require('express-session');
const flash = require('connect-flash');

// ADDED: require mongostore
const MongoStore = require('connect-mongo');

// ADDED: require mongoose
const mongoose = require('mongoose');

module.exports = (app) => {
	app.set('trust proxy', 1);
	app.use(flash());

	app.use(
		session({
			secret: process.env.SESS_SECRET,
			resave: true,
			saveUninitialized: false,
			cookie: {
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				maxAge: 60000000
			},
			store: MongoStore.create({
				mongoUrl: process.env.DB_REMOTE
			})
		})
	);
};
