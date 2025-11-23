const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedbackSchema = new Schema({
    like: {
        type: Boolean,
        required: true,
        default: false
    },
    unlike: {
        type: Boolean,
        required: true,
        default: false
    },
    feedbackDesc: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('feedbacks', feedbackSchema);   