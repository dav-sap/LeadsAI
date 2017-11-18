var express = require('express');
var router = express.Router();
var users = require('./../db/users.js');
var consultants = require('./../db/consultants');
var photographers = require('./../db/photographers');

router.post('/new_user', function (req, res, next) {
    var newUserJson = req.body;
    users.create(newUserJson, function (err, newUser) {
        if (err) {
            res.send({success: false, info:"New User error! " + err.message})
        } else {
            res.send({success: true, info:"New User saved!"})
        }
    })

});
router.post('/referenced_user', function (req, res, next) {
    var reqBody = req.body;
    if (reqBody.referencedPhotographer && reqBody.phoneNumber && reqBody.email && reqBody.referred) {
        consultants.findOne({phoneNumber: reqBody.referred}, function (err, consultant) {
            if (consultant && consultant._id) {
                photographers.findOne({phoneNumber: reqBody.referencedPhotographer}, function (err, refPhotographer) {
                    if (refPhotographer && refPhotographer._id) {
                        var reference = {photographer: refPhotographer._id, consultant: consultant._id, date: new Date()};
                        users.findOneAndUpdate({phoneNumber: reqBody.phoneNumber, email: reqBody.email}, {$push: {references: reference}}, function(err, doc) {
                            if (err) {
                                res.send({success: false, info:"Can't update user: " + reqBody.email + ". Error: " + err.message})
                            } else {
                                if (doc) {
                                    res.send({success: true, info: "User " + reqBody.email + " updated"})
                                } else {
                                    res.send({success: false, info:"Can't update user: " + reqBody.email + ". Error: No user found for email: "+reqBody.email+": ,and phone number: "+reqBody.phoneNumber})
                                }
                            }
                        })
                    } else {res.send({success: false, info:"Can't update user: " + reqBody.email + ". Error: phone number of photographer is wrong"})}

                });
            } else {res.send({success: false, info:"Can't update user: " + reqBody.email + ". Error: phone number of consultant is wrong"})}
        });
    } else {
        res.send({success: false, info:"Can't update user. Error: email: "+ reqBody.email + ", phone number: " +
                    reqBody.phoneNumber + ", consultant phone number: " + reqBody.referencedPhotographer + ", photographer phone number: " +reqBody.referred})
    }
});
//TODO:: remove from future use
router.get('/get_user', function (req, res, next) {
    var userJson = req.headers;
    if (userJson.phonenumber && userJson.email) {
        users.findOne({phoneNumber: userJson.phonenumber, email:userJson.email}, function (err, user) {
            if (err) {
                res.send({success: false, info: "User not found Error:  " + err.message})
            } else {
                if (user) {
                    res.send({success: true, info: "User Found: ", user: user})
                } else {
                    res.send({success: false, info: "User not found Error: No user found for email: "+userJson.email+": ,and phone number: "+userJson.phoneNumber})
                }
            }
        }).
        populate('references.consultant references.photographer').exec(function (err, user) {
            console.log('The consultant 1 %s', user);
            console.log('The consultant is %s', user.references[0].consultant.name);
        });
    } else {
        res.send({success: false, info: "Get User error: phone number: "+ userJson.phoneNumber + ", or email: " + userJson.email + ". Not Correct"})
    }

});

router.post('/remove_user', function (req, res, next) {
    var remUserJson = req.body;
    if (remUserJson.phoneNumber && remUserJson.email) {
        users.findOneAndRemove(remUserJson, function (err, user) {
            if (err) {
                res.send({success: false, info: "User not found Error:  " + err.message})
            } else {
                if (user) {
                    res.send({success: true, info: "User Found and removed"})
                } else {
                    res.send({
                        success: false,
                        info: "User not found Error: No user found for email: " + remUserJson.email + ": ,and phone number: " + remUserJson.phoneNumber
                    })
                }
            }
        })
    } else {
        res.send({success: false, info: "User finding error: phone number: "+ remUserJson.phoneNumber + ", or email: " + remUserJson.email + ". Not Correct"})
    }
});

module.exports = router;
