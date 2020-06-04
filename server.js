const app = require('express')();
const bodyParser = require('body-arser');

const authRoute = require('./util/routes/auth');
const userRoute = require('./util/routes/user');

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoute);
app.use('/user', userRoute);

module.exports = app;
