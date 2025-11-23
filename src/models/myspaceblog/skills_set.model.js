const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var skillSetSchema = new Schema({
    primary_skills: {
        type: String,
        required: true
    },
    secondary_skills: {
        type: String,
        required: true
    },
    additional_skills: {
        type: String,
        required: true
    },
    cloud_skills: {
        type: String,
        required: true
    },
    tools_techs: {
        type: String,
        required: true
    },
    operating_systems: {
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

module.exports = mongoose.model('skills_set', skillSetSchema);