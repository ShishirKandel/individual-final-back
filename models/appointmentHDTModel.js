const mongoose = require("mongoose");

const appointmentHDT = new mongoose.Schema({
    healthCategoryID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'HealthCategory',
    },
    date :{
        type: String,
        require : true,
    },
    time:{
        type: Array,
        require : true,
    }
})

module.exports = mongoose.model("AppointmentHDT", appointmentHDT)