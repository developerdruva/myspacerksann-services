const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pocProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: '-'
    },
    project_url: {
        type: String,
        required: true,
        default: '-'
    },
    project_type: {
        type: String,
        required: true,
        default: '-'
    },
    title_subdesc: {
        type: String,
        required: true,
        default: '-'
    },
    project_desc: {
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
    created_at: {
        type: String,
        required: true,
        default: Date.now()
    },

})

module.exports = mongoose.model('poc_projects', pocProjectSchema);
