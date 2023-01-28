const mongoose = require('mongoose');

const doctorAppointment = new mongoose.Schema({
    department : {
        type: String,
        require : true
    },
    date : {
        type : String,
        require : true
    },
    time:{
        type: String,
        require : true
    },
    fullname : {
        type : String,
        require : true
    },
    mobile : {
        type : String,
        require : true
    },
    email : {
        type : String
    },
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Patient'
    },
    doctorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor"
    },
    status :{
        type : String,
        require : true
    },
    price :{
        type : String,
    }
})

module.exports = mongoose.model("DoctorAppointment", doctorAppointment)