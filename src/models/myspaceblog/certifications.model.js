const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var certifications = new Schema({
    certify_name: {
        type: String,
        required: true
    },
    certify_url: {
        type: String,
        required: true
    },
    certify_type: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    created_ip: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true,
        default: Date.now()
    },


})

module.exports = mongoose.model('certifications', certifications);   