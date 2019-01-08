const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Film = require("../models/film");


//Create router for signup or register the new user
router.post('/signup', function(req,res) {

    if(!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });

        // save the user
        newUser.save(function(err) {
            if(err) {
                console.log(err);
                return res.json({success: false, msg: 'email already exists'});
            }

            res.json({success: true, msg: 'Successful created new user'});
        });
    }
});

module.exports = router;