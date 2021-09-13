// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
// Adding sessions require
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'project2_ironhack';
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

//------------------------------------------------------------
const signup = require('./routes/signup.route');
app.use('/', signup);

//cryptocurrency routes
const crypto = require('./routes/coinApi.route');
app.use('/', crypto);

//cryptocurrency routes
const graphs = require('./routes/graphs.route');
app.use('/', graphs);

//cryptocurrency routes
const userProfile = require('./routes/user.route');
app.use('/', userProfile);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
