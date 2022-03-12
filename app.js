const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const db = require('./config/database');

const session = require('express-session');
const MongoStore = require('connect-mongo');


//Access to .env file
dotenv.config();

//Middleware that allow express server to past different types
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Session setup

const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_LOCAL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    collectionName: 'sessions'
  });
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false, //don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 //Equals 1 day
    }
}));

/*--PASSPORT--*/
require('./config/passport');
app.use(passport.initialize()); //Make it safe to refresh the passport middleware every time that load the route
app.use(passport.session()); //This about serializeUser and deserializeUser and Express session Middleware


app.use((req, res, next) => {
    console.log(req.session);//from express session
    console.log(req.user);//from passport middleware
    next();
});


/*--ROUTES--*/
app.use(routes);


app.listen(5000);