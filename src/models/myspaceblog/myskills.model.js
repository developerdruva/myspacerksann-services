const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var myskillSchema = new Schema({
    skill_name: {
        type: String,
        required: true
    },
    skill_value: {
        type: String,
        required: true
    },
    skill_seq: {
        type: String,
        required: true
    },
    skill_style: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('myskills', myskillSchema);   