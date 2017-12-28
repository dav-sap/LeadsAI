const express = require('express');
const router = express.Router();
const fs = require('fs');
const consultants = require('./../db/consultants.js');


router.post('/new_consultant', function (req, res, next) {
    var newConsulJson = req.body;
    consultants.create(newConsulJson, function (err, newConsul) {
        if (err) {
            res.send({success: false, error: "Consultant Not Added", info:err.message})
        } else {
            res.send({success: true, info: "New Consultant saved!", consultant: newConsul});
        }
    })

});
router.post('/add_pic', (req, res, next) =>{
    let consultantJson = req.body;
    console.log(consultantJson);
    if (consultantJson.phoneNumber && consultantJson.email && consultantJson.imgPath) {
        consultants.findOne({
            phoneNumber: consultantJson.phoneNumber,
            email: consultantJson.email
        }).then((consultant) => {
            if (!consultant) {
                throw({status: 400,
                    error: "No Document Found",
                    info: "No consultant found for phone number: " + consultantJson.phoneNumber + ", email: " + consultantJson.email + ". Incorrect"
                });
            } else {
                consultant.picture.data = fs.readFileSync(consultantJson.imgPath);
                consultant.picture.contentType = 'image/jpg';
                return consultant.save();
            }
        }).then(consultant => res.send(consultant)
        ).catch(err => {
            if (err.status) {
                res.status(err.status).send({error: err.error,info:err.info})
            } else res.status(500).send({error: err.toString()})
        })

    } else {
        res.status(400).send({error: "JSON ERROR", info: `phone number: ${consultantJson.phoneNumber}, email: ${consultantJson.email}, or imgPath: ${consultantJson.imgPath}. Not Correct`})
    }
});
router.get('/get_consultants', (req, res, next) => {
    consultants.find({}, (err, users) => {
        res.send(users);
    });
});
router.post('/get_consultant_picture', (req, res, next) =>{
    let consultantJson = req.body;
    if (consultantJson.phoneNumber && consultantJson.email) {
        consultants.findOne({
            phoneNumber: consultantJson.phoneNumber,
            email: consultantJson.email
        }).then((consultant) => {
            if (!consultant) {
                throw({status: 400,
                    error: "No Document Found",
                    info: "No consultant found for phone number: " + consultantJson.phoneNumber + ", email: " + consultantJson.email + ". Incorrect"
                });
            } else {
                res.contentType(consultant.picture.contentType);
                res.send(consultant.picture.data);
            }
        }).catch(err => {
            if (err.status) {
                res.status(err.status).send({error: err.error,info:err.info})
            } else res.status(500).send({error: err.toString()})
        })

    } else {
        res.status(400).send({error: "JSON ERROR", info: `phone number: ${consultantJson.phoneNumber}, email: ${consultantJson.email}, or imgPath: ${consultantJson.imgPath}. Not Correct`})
    }
});
router.post('/remove_consultant', function (req, res, next) {
    var remConsultantJson = req.body;
    if (remConsultantJson.phoneNumber && remConsultantJson.email) {
        consultants.findOneAndRemove(remConsultantJson, function (err, consultant) {
            if (err) {
                res.send({success: false, error: "No Document Found", info: err.message})
            } else {
                if (consultant) {
                    res.send({success: true, info: "Consultant Found and removed: " + consultant})
                } else {
                    res.send({
                        success: false,
                        error: "No Document Found",
                        info: "No Consultant found for email: " + remConsultantJson.email + " ,and phone number: " + remConsultantJson.phoneNumber
                    })
                }
            }
        })
    } else {
        res.send({success: false, error: "JSON ERROR", info: "phone number: "+ remConsultantJson.phoneNumber + ", or email: " + remConsultantJson.email + ". Not Correct"})
    }
});
module.exports = router;

