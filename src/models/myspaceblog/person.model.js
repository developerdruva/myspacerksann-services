const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var personSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    roleof_person: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    created_ip: {
        type: String,
        required: true,
        default: '-'
    },
    created_at: {
        type: String,
        required: true,
        default: Date.now()
    }

})

module.exports = mongoose.model('person_details', personSchema);