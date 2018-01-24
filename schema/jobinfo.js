var mongoose = require("mongoose");

//创建schema :文档集合的映射
var jobSchema = mongoose.Schema({
	jobname:String,
	companyname:String,
	jobex:String,
	jobtype:String,
	jobplace:String,
	money:String,
	img:String,
	user:String
});

module.exports = jobSchema;