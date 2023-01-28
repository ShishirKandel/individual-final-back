const express = require('express');
const router = new express.Router();
const appointment = require("../models/appointmentModel");
const doctorAppointment = require("../models/doctorAppointmentModel");
const auth = require("../auth/auth");
const upload = require("../fileUpload/fileUpload")



// route to book appointment


// ########################################## for booking doctor appointment $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

router.post("/patient/bookDoctorAppointment/get", auth.patient_guard, async (req,res)=>{
    const date = req.body.date;
    const time = req.body.time;
    const doctorId = req.body.doctorId;
    const patientId = req.patientINFO._id;
    const department = req.body.department;
    const fullname = req.body.fullname;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const price = req.body.price;
    const doctorAppointmentDetails = await doctorAppointment.findOne({patientId : patientId, doctorId : doctorId, date : date, time : time})
    if(doctorAppointmentDetails == null){
        const data = new doctorAppointment({
            date : date,
            time : time,
            doctorId : doctorId,
            patientId : patientId,
            department : department,
            fullname : fullname,
            mobile : mobile,
            email : email,
            price : price,
            status : "Bidding"
        })

        data.save()
        .then(()=>{
            res.json({msg : "Doctor Appointment Booked"})
        })
        .catch((e)=>{
            res.json({msg : "Doctor Booking failed"})
        })
    } else{
        res.json({msg : "Already Appointment"})
    }
})

 
router.get("/patient/getBookedDoctorAppointment/get", auth.patient_guard, async(req,res)=>{
    const doctorBookedAppointment = await doctorAppointment.find({patientId : req.patientINFO._id}).populate("doctorId")
    if(!doctorBookedAppointment){
        res.status(500).json({success : false, msg : "Error no booked appointment"})
    } else{
        res.status(200).json({success: true , data : doctorBookedAppointment})
    }
})

router.put("/patient/updateBookedDoctorAppointment/get/:appointmentId", async(req,res)=>{
    
    const fullname = req.body.fullname;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const date = req.body.date;
    const time = req.body.time;
    const status = req.body.status;
    const price = req.body.price;

    doctorAppointment.updateOne(
            {_id : req.params.appointmentId},
            {
                price : price,
                status : status,
            }
        )
        .then(()=>{
            res.json({msg : "Updated"})
        })
        .catch((e)=>{
            res.json({msg : "Cannot Update"})
        })
})

router.delete("/patient/deleteBookedDoctorAppointment/get/:appointmentId", auth.patient_guard,(req,res)=>{
    console.log(req.params.appointmentId)
    doctorAppointment.deleteOne({_id : req.params.appointmentId })
    .then(()=>{
        res.send({msg: "Doctor Appointment Deleted", success: true})
    })
    .catch((e)=>{
        res.send({msg: "Cannot Delete Doctor Appointment",success: false})
    })
})


module.exports = router;