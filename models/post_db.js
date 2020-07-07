//Dependencies
var mongoose =require('mongoose');
var Schema = mongoose.Schema;

//create Schema
var postSchema = new Schema({
	title:String,
	description:String,
	image:String
	});

// the schema is useless so far
// we need to Create a model using it
var Post = mongoose.model("Post", postSchema);

//export module
module.exports = {Post};