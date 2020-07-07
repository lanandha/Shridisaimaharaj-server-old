const express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var routes =express.Router();
const Post=require('../models/post_db').Post;

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/post",{ useNewUrlParser: true,useUnifiedTopology: true });

routes.post("/create", (req, res) => {
 	var myData = new Post(req.body);
 myData.save()
 .then(item => {
 //	res.send('message saved database');
 res.send(req.body);
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 }); 
});


module.exports=routes;