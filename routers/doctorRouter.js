const express = require('express');
const router = new express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');

const jwt = require('jsonwebtoken');

const doctor = require('../models/doctorModel');
const doctorAppointment = require("../models/doctorAppointmentModel");
const outlet = require("../models/outletModel");
// const { append } = require('express/lib/response');

// register for doctor
router.post('/doctor/register',auth.admin_guard, upload.single('doc_img'),(req,res)=>{
    const email = req.body.email;

    doctor.findOne({email : email})
    .then((email_details)=>{
        if(email_details!=null){
            return res.json({msg:"Already Email"});
        }
        const fname = req.body.fname;
        const lname = req.body.lname;
        const password = req.body.password;
        const username = req.body.username;
        const address = req.body.address;
        const phone = req.body.phone;
        const age = req.body.age;
        const gender = req.body.gender;
        const department = req.body.department;
        const picture = req.file.filename;
        const lat = req.body.lat;
        const lng = req.body.lng;
        const price = req.body.price;
        


        bcryptjs.hash(password,10, (e,hashed_pw)=>{
            const data = new doctor({
                fname : fname,
                lname :lname,
                email : email,
                password : hashed_pw,
                username : username,
                address : address,
                phone : phone,
                age : age,
                gender : gender,
                department : department,
                picture : picture,
                lat : lat,
                lng : lng,
                price : price,
            })
    
            data.save()
            .then(()=>{
                res.json({msg : "registered"})
            })
            .catch((e)=>{
                res.json({msg : "error"})
            })
        })
    })
    .catch(()=>{

    })
})


// Login for doctor
router.post('/doctor/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    doctor.findOne({email : email})
    .then((doctor_data)=>{
        if(doctor_data == null){
            return res.json({msg : "Invalid Credentials"})
        }
        bcryptjs.compare(password,doctor_data.password,(e,result)=>{
            if(result == false){
                return res.json({ msg : "Invalid Credentails"})
            } 
            // Now everything is valid 
            // Creates the token for logged in user
            // token stores logged in user's id
            const token = jwt.sign({dID : doctor_data._id}, "B3AV3R69");
            res.json({token : token,msg : "Login Success"});
        })
    })
    .catch((e)=>{

    })

})


router.get("/doctor/get/:doc_id", async (req,res)=>{
    const doctor_details = await doctor.findOne({_id : req.params.doc_id})
    if(!doctor_details){
        res.json({msg : "Error in retrieving doc"})
    } else{
        res.json({data : doctor_details})
    }
})


router.get('/doctor/dashboard/single',auth.doctor_guard ,(req,res)=>{
    res.json({
        id : req.doctorINFO._id,
        fname : req.doctorINFO.fname,
        lname : req.doctorINFO.lname,
        gender : req.doctorINFO.gender,
        age : req.doctorINFO.age,
        email : req.doctorINFO.email,
        username : req.doctorINFO.username,
        phone: req.doctorINFO.phone,
        address : req.doctorINFO.address,
        department : req.doctorINFO.department,
        picture : req.doctorINFO.picture,
        lat : req.doctorINFO.lat,
        lng : req.doctorINFO.lng,
    })
})


router.get('/doctor/dashboard/get/admin', async (req,res)=>{
    console.log("Errororororr")
    const doctor_details = await doctor.find({})
    res.json({
        details: doctor_details
    })
})


router.get("/doctor/category/:department", async(req,res)=>{
    const doctor_details = await doctor.find({department : req.params.department})
    res.json({
        details : doctor_details
    })
})

router.get("/user/outlet", async(req,res)=>{
    const outlet_details = await outlet.find({})
    res.json({
        details : outlet_details
    })
})



// this is dashboard update route
router.put('/doctor/update/get/:doctor_id',auth.admin_guard, upload.single('doc_img'), (req,res)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const id = req.params.doctor_id;
    // const picture = req.file.filename;
    if(req.file == undefined){
        doctor.updateOne({_id : id}, {fname :fname, lname: lname, username : username})
        .then(()=>{
            res.json({msg : "updated"})
        })
        .catch((e)=>{
            res.json({msg : "cannot update"})
        })
    } else{
        doctor.updateOne({_id : id}, {fname :fname, lname: lname, username : username, picture : req.file.filename})
        .then(()=>{
            res.json({msg : "updated"})
        })
        .catch((e)=>{
            res.json({msg : "cannot update"})
        }) 
    }

    // doctor.updateOne({_id : req.doctorINFO._id}, {fname :fname, lname: lname, username : username})
    
})

/// view single docrtor

router.get("/doctor/single/get/:doctor_id",auth.admin_guard, (req,res)=>{
    doctor.findOne({_id: req.params.doctor_id})
    .then((data)=>{
        res.json({data: data})
    })
    .catch((e)=>{
        res.json({error: e})
    })
})


// this is for updating profile picture 

router.put('/doctor/update_picture',auth.doctor_guard,upload.single('doc_img'), (req,res)=>{
    if(req.file == undefined){
        return res.json({msg : "Invalid file format"})
    }
    
    // const picture = req.body.picture;
    doctor.updateOne({_id : req.doctorINFO._id}, {picture : req.file.filename })
    .then(()=>{
        res.send({msg : "img success"})
    })
    .catch((e)=>{
        res.send({msg : "failure"})
    })
    // console.log(req.file);
})

router.delete("/doctor/delete/get/:doctor_id",auth.admin_guard,(req,res)=>{
    const doctor_id = req.params.doctor_id;
    doctor.deleteOne({_id : doctor_id })
    .then(()=>{
        res.send({msg: "Doctor Deleted", success: true})
    })
    .catch((e)=>{
        res.send({msg: "Doctor not deleted"})
    })
})


// router for getting appointment
router.get("/doctor/getAppointment/:status", auth.doctor_guard, async(req,res)=>{
    const appointmentDetails = await doctorAppointment.find({doctorId : req.doctorINFO._id, status : req.params.status}).populate("patientId")
    if(!appointmentDetails){
        res.json({success : false,msg : "Appointment Not Found"})
    } else{
        res.json({success : true, data : appointmentDetails})
    }
})

//  for changing the status of the appointment 
router.put("/doctor/updateAppointmentStatus/:appointmentId", async(req,res)=>{
    
    doctorAppointment.updateOne(
            {_id : req.params.appointmentId},
            {
                status : req.body.appointmentStatus
            }
        )
        .then(()=>{
            res.json({msg : "Updated Status"})
        })
        .catch((e)=>{
            res.json({msg : "Cannot Update"})
            console.log(e)
        })
})


module.exports =router