var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var photographersSchema = require('./photographers');
var consultantsSchema = require('./consultants');
var schemaConsts = require('./consts');

var usersSchema = new Schema({
    name:  {type: String, required: true},
    email: {type: String, validate: validators.isEmail(), required: true, unique: true},
    phoneNumber:  {type: String, validate: [validators.isNumeric(), validators.isLength(10,10)], required: true, unique: true},
    references: [{photographer: {type: mongoose.Schema.Types.ObjectId, ref:photographersSchema.modelName}, consultant: {type: mongoose.Schema.Types.ObjectId, ref:consultantsSchema.modelName}, date: Date}],
});



module.exports = mongoose.model(schemaConsts.USERS, usersSchema);
