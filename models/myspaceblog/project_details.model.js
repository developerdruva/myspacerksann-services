const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var workedProjectSchema = new Schema({
    company_name: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
    project_desc: {
        type: String,
        required: true
    },
    role_name: {
        type: String,
        required: true
    },
    industry_type: {
        type: String,
        required: true
    },
    responsibilities: {
        type: String,
        required: true
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
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
    },

})

module.exports = mongoose.model('worked_projects', workedProjectSchema);