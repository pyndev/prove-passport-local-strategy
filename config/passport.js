const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const User = db.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;


const verifyCallback = (username, password, done) => {

    User.findOne({ username: username })
        .then((user) => {

            if (!user) { return done(null, false) }
            
            const isValid = validPassword(password, user.hash, user.salt);
            
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });

}

const strategy  = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => { //Put user.id in the session
    done(null, user.id);
});

passport.deserializeUser((userId, done) => { //Grab out the user from database base on user id from session
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});
