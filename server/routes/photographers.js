var express = require('express');
var router = express.Router();
var photographers = require('./../db/photographers.js');


router.post('/new_photographer', function (req, res, next) {
    var newPhotographerJson = req.body;
    photographers.create(newPhotographerJson, function (err, newPhotographer) {
        if (err) {
            res.send({success: false, info:"New Photographer error! " + err.message})
        } else {
            res.send({success: true, info: "New Photographer saved!"});
        }
    })

});

module.exports = router;

