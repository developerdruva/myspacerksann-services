const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studieSchema = new Schema({
    study: {
        type: String,
        required: true,
        default: '-'
    },
    study_intitute: {
        type: String,
        required: true,
        default: '-'
    },
    study_seq: {
        type: String,
        required: true,
        default: '-'
    },
    pass_percent: {
        type: String,
        required: true,
        default: '-'
    },
    study_desc: {
        type: String,
        required: true,
        default: '-'
    },

})

module.exports = mongoose.model('studies', studieSchema);

