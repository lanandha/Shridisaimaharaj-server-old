const express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var routes =express.Router();
const User=require('../models/gratitude_db').Gratitude;

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

//mongoose.connect("mongodb://localhost:27017/gratitude",{ useUnifiedTopology: true, useNewUrlParser: true});

routes.post("/addname", (req, res) => {
 	var myData = new User(req.body);
 myData.save()
 .then(item => {
 	res.send('message saved database');
 //res.send(req.body);
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 }); 
});
module.exports=routes;