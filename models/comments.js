var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    filmID: {
        type: String,
        required: true
    },
},{
    timestamps: true
}
);

module.exports = mongoose.model('Comment', commentSchema);