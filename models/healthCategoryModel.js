const mongoose = require("mongoose");

const healthCategory = new mongoose.Schema({
    name:{
        type: String,
        require: true
    }
})


module.exports = mongoose.model('HealthCategory', healthCategory)