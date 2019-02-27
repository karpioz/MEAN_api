const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Film = require("../models/film");
const Comment = require("../models/comments");


//Create router for signup or register the new user
router.post('/signup', function(req,res) {

    if(!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password'});
    } else {
        console.log(req.body.email);
        console.log(req.body.password);
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        console.log(newUser);
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

router.post('/signin', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            console.log(err);
            throw err;
        }

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found'});

        } else {
            // check for password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    //if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }

    });
});

// Create Film Review

router.post('/film', passport.authenticate('jwt', {session: false}), function(req,res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);
        var newFilm = new Film({

            title: req.body.title,
            director: req.body.director,
            studio: req.body.studio,
            year: req.body.year,
            review: req.body.review,
            reviewer: req.body.reviewer,
            img: req.body.img
        });

        newFilm.save(function(err) {
            if(err) {
                console.log(err);
                return res.json({success: false, msg: 'Save film failed.'});
            }
            res.json({success: true, msg: 'Successful created new film.'});
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

getToken = function(headers){
    if(headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if(parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// Get all films

router.get('/film', passport.authenticate('jwt', {session: false}), function(req,res){
    var token = getToken(req.headers);
    if(token) {
        Film.find(function(err,films) {
            if(err) return next(err);
            res.json(films);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

// Get single film by ID

router.get('/film:id', passport.authenticate('jwt', {session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token) {
        console.log("the id is: ");
        console.log(req.params.id);
        Film.findById( new mongoose.Types.ObjectId(req.params.id), function(err, post) {
            if(err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

// UPDATE film review

router.put('/film:id', passport.authenticate('jwt', {session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token) {
        Film.findOneAndUpdate({'_id':req.params.id}, req.body, function(err, post) {
            if(err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

// DELETE film review

router.delete('/film:id', passport.authenticate('jwt', {session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token) {
        Film.findOneAndDelete({'_id': req.params.id}, req.body, function(err, post){
            if(err) return next(err);
            res.json(post);
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

// Comments REST Services

// Create comment
router.post('/comment', passport.authenticate('jwt',{session: false}), function(req,res){
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);
        var newComment = new Comment({
            comment: req.body.comment,
            userID: req.body.userID,
            filmID: req.body.filmID
        });

        newComment.save(function(err) {
            if(err){
                return res.json({success: false, msg: 'Save comment failed'});
            }
            res.json({success: true, msg: 'Successful created new comment'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized'});
    }
})

// GET comments by filmID
router.get('/comment:filmID', passport.authenticate('jwt',{session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token){
        Comment.find({filmID: req.params.filmID})
            .exec(function(err,posts){
                if(err) return next(err);
                console.log('The posts are an array: ', posts);
                res.json(posts);
            });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized'});
    }
});

// DELETE comment
router.delete('/comment:id', passport.authenticate('jwt', {session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token){
        Comment.findByIdAndRemove(req.params.id, req.body, function(err,post){
            if(err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized'});
    }
});

// UPDATE comment
router.put('/comment:id', passport.authenticate('jwt', {session: false}), function(req,res,next){
    var token = getToken(req.headers);
    if(token){
        Comment.findByIdAndUpdate(req.params.id, req.body, function(err,post){
            if(err) return next(err);
            res.json(post);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized'});
    }
});



module.exports = router;