const { https } = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();

const validateFirebaseIdToken = require('./middlewares/auth');
const usersRoute = require('./routes/users');

const app = express();

app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.use('/users', usersRoute);

export default https.onRequest(app);
