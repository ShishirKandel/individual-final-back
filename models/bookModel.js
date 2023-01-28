
const mongoose = require('mongoose')

const book = new mongoose.Schema({
    name : {
        type : String,
    },
    desc: {
        type : String,
    },
    image : {
        type : String,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Patient'
    }
})


module.exports = mongoose.model('book', book);