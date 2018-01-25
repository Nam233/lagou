var mongoose = require("mongoose");
var JobSchema = require('../schema/jobinfo');
var Jobinfo = mongoose.model('jobinfos',JobSchema);
module.exports = Jobinfo;