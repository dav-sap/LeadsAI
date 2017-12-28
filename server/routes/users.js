var express = require('express');
var router = express.Router();
var users = require('./../db/users.js');
var consultants = require('./../db/consultants');
var photographers = require('./../db/photographers');

router.post('/new_user', function (req, res, next) {
    var newUserJson = req.body;
    users.create(newUserJson).then( (newUser) => {
        res.send({info:"New User saved!", user: newUser})
    }).catch((err) => {
        res.send.status(500)({error: "New User error", info:err.message})
    })

});
router.post('/referenced_user', function (req, res, next) {
    let reqBody = req.body;
    Promise.all([ photographers.findOne({phoneNumber: reqBody.referencedPhotographer}), consultants.findOne({phoneNumber: reqBody.referred})])
    .then((args) => {
        let consultant = args[1];
        let photographer = args[0];
        if (consultant && consultant._id && photographer && photographer._id) {
            let reference = {photographer: photographer._id, consultant: consultant._id, date: new Date()};
             return users.findOneAndUpdate({phoneNumber: reqBody.phoneNumber, email: reqBody.email}, {$push: {references: reference}});
        } else throw {message: "Could not find consultant or photographer"}
    }).then((user) => {F
        if (user) {
            res.send({info: "User " + reqBody.email + " updated", user: user})
        } else throw {message: "Could not find user to update"}
    }).catch( (err) => {
        res.send.status(500)({error:"Can't update user",  info: err.message});
    })
});
router.get('/get_users', function (req, res, next) {
    users.find({}).then( (users) =>{
        res.send({info: "User Found: ", users: users})
    }).catch(err => res.send.status(500)({error: "Error find users", info: "User Founod"}));


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
    let userToRemoveJson = req.body;
    users.findOneAndRemove({phoneNumber: userToRemoveJson.phoneNumber, email: userToRemoveJson.email}).then((user) => {
        if (user) {
            res.send({info: "User Found and removed"})
        } else throw {message: "No user found for email: " + userToRemoveJson.email + ": ,and phone number: " + userToRemoveJson.phoneNumber}
    }).catch( (err) => {
        res.send.status(500)({error: "User not removed!", info: err.message})
    })
});

module.exports = router;
