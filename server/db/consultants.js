var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var schemaConsts = require('./consts');

var consultantsSchema = new Schema({
    name:  {type: String, required: true},
    email: {type: String, validate: validators.isEmail(), required: true, unique: true},
    phoneNumber:  {type: String, validate: [validators.isNumeric(), validators.isLength(10,10)], required: true, unique: true},
    profile_pic: { data: Buffer, contentType: String },
    profile_pic_bw: { data: Buffer, contentType: String },
});



module.exports = mongoose.model(schemaConsts.CONSULTANTS, consultantsSchema);

