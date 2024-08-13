const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var workedCompanieSchema = new Schema({
    company_name: {
        type: String,
        required: true,
        default: '-'
    },
    designation: {
        type: String,
        required: true,
        default: '-'
    },
    from_date: {
        type: String,
        required: true,
        default: '-'
    },
    to_date: {
        type: String,
        required: true,
        default: '-'
    },
    email_id: {
        type: String,
        required: true,
        default: '-'
    },
    created_ip: {
        type: String,
        required: true,
        default: '-'
    },
    numberof_projects: {
        type: String,
        required: true,
        default: '-'
    },

})

module.exports = mongoose.model('worked_companies', workedCompanieSchema);

