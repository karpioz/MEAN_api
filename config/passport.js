const JwtStrategy = require('passport-jwt').Strategy; // set up jvt token strategy
const ExtractJwt = require('passport-jwt').ExtractJwt; // set up extract JWT

// load up the user model
const User = require('../models/user'); // get the user model
const config = require('./database'); // get db config file

module.exports = function(passport) {
    let opts = {};
    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
    };

    passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });

    }));
};