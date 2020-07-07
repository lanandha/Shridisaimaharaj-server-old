var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	name: String,
	birthday:String,
	mobilenumber: Number,
	password: String,
	passwordConf: String
}),
Userdata = mongoose.model('Userdata', userSchema);

module.exports = {Userdata};