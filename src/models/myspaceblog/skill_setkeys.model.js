const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var skillSetKeys = new Schema({
    key_name: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('skillset_keys', skillSetKeys);