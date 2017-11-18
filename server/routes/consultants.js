var express = require('express');
var router = express.Router();
var consultants = require('./../db/consultants.js');


router.post('/new_consultant', function (req, res, next) {
    var newConsulJson = req.body;
    consultants.create(newConsulJson, function (err, newConsul) {
        if (err) {
            res.send({success: false, info:"New Consultant error! " + err.message})
        } else {
            res.send({success: true, info: "New Consultant saved!"});
        }
    })

});

module.exports = router;

