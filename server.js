const app = require('express')();

const authRoute = require('./util/routes/auth');
const userRoute = require('./util/routes/user');

// Routes
app.use('/auth', authRoute);
app.use('/user', userRoute);

module.exports = app;
