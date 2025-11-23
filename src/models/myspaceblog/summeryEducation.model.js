const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var summEducationSchema = new Schema({
    summary_desc: {
        type: String,
        required: true
    },
    studies: {
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
        required: true
    },
})

module.exports = mongoose.model('summery_education', summEducationSchema);
