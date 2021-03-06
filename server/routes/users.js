var express = require('express');
var router = express.Router();
var users = require('./../db/users.js');
var consultants = require('./../db/consultants');
var photographers = require('./../db/photographers');
// import BOT_LOGIC from './../src/BotLogic'

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
    }).then((user) => {
        if (user) {
            res.send({info: "User " + reqBody.email + " updated", user: user})
        } else throw {message: "Could not find user to update"}
    }).catch( (err) => {
        res.status.send(500)({error:"Can't update user",  info: err.message});
    })
});
router.get('/get_users', function (req, res, next) {
    users.find({}).then( (users) =>{
        res.send({info: "User Found: ", users: users})
    }).catch(err => res.status(500).send({error: "Error find users", info: "User Founod"}));


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
        res.status.send(500)({error: "User not removed!", info: err.message})
    })
});
// router.get('/bot_logic', function (req, res, next) {
//     res.send({bot:BOT_LOGIC})
// });
router.post('/add_user', function (req, res, next) {
    let userJson = req.body;
    let startDate = new Date();
    users.create({name:userJson.name, chat: {data: [], date: startDate}}).then( (newUser) => {
        res.send({info:"User saved!", user: newUser, chatStartDate: startDate})
    }).catch((err) => {
        res.status(500).send({error: "User error", info:err.message})
    })

});
router.post('/add_chat_answer', function (req, res, next) {
    let userJson = req.body;
    users.findOne({_id: userJson._id})
        .then((user) => {
            if (!user) throw "No user found";
            let indexToAdd = null;
            user.chat.find((val, index) => {
                let dateFromReq = new Date(userJson.startDate);
                if(val.date.getTime() === dateFromReq.getTime()) {
                    indexToAdd = index;
                    return true;
                }
            });
            if (indexToAdd !== null) {
                user.chat[indexToAdd].data.push({question: userJson.question, answer: userJson.answer});
                user.save((user) => {
                    res.send({info: "User Found and question answer added"})
                })
            } else throw "No chat matching attribs found";
        }).catch(err => {
            res.status(500).send({error: "Chat Answer not added", info: err.toString()})
        })
});

module.exports = router;
