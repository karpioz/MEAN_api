const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['reader', 'creator', 'editor'],
        default: 'reader'
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function(next) {
    let user = this;
    let SALT_FACTOR = 5;

    if(!user.isModified('password')) {
        return next();

        // code to generate salt for salt for encryption
        bcrypt.genSalt(SALT_FACTOR, function(err, salt){
            if(err) {
                return netx(err);
            }
            // code to hash the password
            bcrypt.hash(user.password, salt,null, function(err,hash) {
                if(err){
                    return next(err);
                }
                user.password = hash;
                next();
            })
        })
    }
})

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch) {
        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    })
}

module.exports = mongoose.model('User', UserSchema);