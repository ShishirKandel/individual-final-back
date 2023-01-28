const express = require('express');
const router = new express.Router();
const auth = require("../auth/auth")
const staff = require("../models/staffModel")
const bcryptjs = require("bcryptjs");
const healthCategory = require("../models/healthCategoryModel");
const appointmentHDT = require("../models/appointmentHDTModel");
const healthCategoryModel = require('../models/healthCategoryModel');


// register staff
router.post("/staff/register",(req,res)=>{
    const email = req.body.email;
    staff.findOne({email : email})
    .then((email_details)=>{
        if(email_details != null){
            return res.json({"msg": "Email Already"});
        }
        const fullName = req.body.fullName;
        const address = req.body.address;
        const phone = req.body.phone;
        const gender = req.body.gender;
        const age = req.body.age;
        const email = req.body.email;
        
        // bcryptjs.hash(password, 10, (e,hashed_pw)=>{
        //     const data = new 
        // })

    })
    .catch((e)=>{})
})
// router for adding health category
// the guard should have been of staff but is right now a customer
router.post("/staff/healthCategory",auth.admin_guard, (req,res)=>{
    const name = req.body.name
    healthCategory.findOne({name: name})
    .then((healthCategoryDetails)=>{
        if(healthCategoryDetails != null){
            return res.json({msg : "Already category"})
        }
        const data = new healthCategory({
            name: name,
        })

        data.save()
        .then(()=>{
            res.json({msg : "Added Category"})
        })
        .catch((e)=>{
            res.json({msg : "Cannot add Category"})
        })
    })
    .catch((e)=>{
        res.json({msg: "Error"})
        console.log(e)
    })

})

router.delete("/staff/healthCategory/delete/:hc_id", auth.admin_guard, (req,res)=>{
    healthCategory.deleteOne({_id : req.params.hc_id})
    .then(()=>{
        res.json({msg : "Delete Success"})
    })
    .catch((e)=>{
        console.log(e)
    })
})


router.get("/staff/healthCategory", async (req,res)=>{
    const healthCategoryList = await healthCategory.find({})
    if(!healthCategoryList){
        res.status(500).json({
            success : false,
            
        })
    } else{
        res.status(201).json({
            success: true,
            data: healthCategoryList,
        })
    }
})

// router for appointment date and time for a particular category 
router.post("/staff/appointment/dateAndtime",auth.admin_guard, async(req,res)=>{
    const date = req.body.date;
    const time = req.body.time;
    const healthCategoryID = req.body.healthCategoryID;
    // console.log(healthCategoryID)
    appointmentHDT.findOne({healthCategoryID: healthCategoryID, date : date})
    .then((appointmentHDTDetails)=>{
        if(appointmentHDTDetails != null){
            console.log(appointmentHDTDetails)
            return res.json({msg: "Already DateAndTime"})
        }
        const data = new appointmentHDT({
            healthCategoryID : healthCategoryID,
            date: date,
            time : time,
        })

        data.save()
        .then(()=>{
            res.json({msg : "Added DateAndTime"})
        })
        .catch((e)=>{
            res.json({msg : "Cannot Add DateAndTime"})
            
        })
    })
    .catch((e)=>{
        res.json({msg : "Error"})
        console.log(e)
    })
})

router.get("/staff/appointment/dateAndtime/:healthCategoryID", async (req,res)=>{
    const healthCategoryID = req.params.healthCategoryID;
    const appointmentHDTList = await appointmentHDT.find({healthCategoryID: healthCategoryID})
    console.log(appointmentHDTList)
    if(!appointmentHDTList){
        res.status(500).json({
            success : false,
        })
    } else{
        res.status(201).json({
            success: true,
            data: appointmentHDTList,
        })
    }
})

router.delete("/staff/appointment/date/:healthCategoryID/:date", async (req,res)=>{
    const healthCategoryID = req.params.healthCategoryID;
    const date = req.params.date;
    const appointmentHDTList = await appointmentHDT.findOne({healthCategoryID: healthCategoryID,date : date})
    console.log(appointmentHDTList)
    appointmentHDT.deleteOne({_id : appointmentHDTList._id})
    .then(()=>{
        res.json({msg : "Deleted Date"})
    })
    .catch((e)=>{
        res.json({msg : "Cannot Delete"})
    })
})

router.put("/staff/appointment/time/delete", async(req,res)=>{
    const healthCategoryID = req.body.healthCategoryID;
    const date = req.body.date;
    const time = req.body.time;
    appointmentHDT.updateOne(
            {healthCategoryID : healthCategoryID,date : date},
            {$pull:{"time" : time}}
        )
    .then(()=>{
        res.send({msg:"time deleted"})
    })
    .catch((e)=>{
        res.send({msg:"time couldnot be deleted"})
        console.log(e);

    })
})

router.get("/staff/get/healthCategoryId/:name", async(req,res)=>{
    const name = req.params.name;
    const healthCategoryDetails = await healthCategory.findOne({name : name})
    console.log(healthCategoryDetails.data)
    if(!healthCategoryDetails){
        res.json({success : false})
    } else{
        res.json({
            success : true,
            data : healthCategoryDetails
        })
    }
})

router.put("/staff/appointment/time/add/:healthCategoryID", async(req,res)=>{
    const healthCategoryID = req.params.healthCategoryID;
    const date = req.body.date;
    const time = req.body.time;
    console.log(healthCategoryID);
    console.log(date);
    console.log(time);

    appointmentHDT.findOne({healthCategoryID : healthCategoryID,date : date,time: time})
    .then((appointment_HDT)=>{
        if(appointment_HDT == null){
            appointmentHDT.updateOne(
                    {healthCategoryID : healthCategoryID,date : date},
                    {$push:{"time" : time}}
                )
            .then(()=>{
                res.json({success:true ,msg:"time added"})
            })
            .catch((e)=>{
                res.json({msg:"time couldnot be added"})
                console.log("Error");
                console.log(e);
    
            })
        } else{
            res.json({success: false,msg:"already same time on same date and category"})
        }
    })
    .catch((e)=>{
        res.json({success: false,msg:"couldnot find data"})

    })
    
})

module.exports = router;


