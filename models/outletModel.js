
const mongoose = require('mongoose')
require('mongoose-double')(mongoose);

const outlet = new mongoose.Schema({
    name : {
        type : String,
    },
    lat:{
        type: mongoose.Schema.Types.Double,
    },
    lng:{
        type: mongoose.Schema.Types.Double,
    },
})


module.exports = mongoose.model('outlet', outlet);