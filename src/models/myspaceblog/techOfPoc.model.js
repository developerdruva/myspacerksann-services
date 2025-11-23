const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usedTechsOfPOCSchema = new Schema({
    tech_name: {
        type: String,
        required: true,
        // default: '-'
    },
    tech_for: {
        type: String,
        required: true,
        // default: '-'
    },
    poc_name: {
        type: String,
        required: true,
        // default: '-'
    },
})

module.exports = mongoose.model('used_techsofpocs', usedTechsOfPOCSchema);