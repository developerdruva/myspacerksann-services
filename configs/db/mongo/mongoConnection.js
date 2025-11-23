const mongoose = require('mongoose');
exports.connectToDB = () => {
    mongoose.connect(process.env.MONGO_URL_ATLAS).then(() => {
        console.log("-----> connected to DB :)");
    }).catch(error => {
        console.log(error)
    })
}