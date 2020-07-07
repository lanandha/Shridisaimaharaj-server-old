const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fs = require('fs');
const app = express();
var config = require('./config/meditationkey');

//use middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(methodOverride('_method'));

//gratitude
const gratitude = require('./routes/gratitude');
app.use('/gratitude',gratitude);

//post experience share
const post = require('./routes/post');
app.use('/post',post);

//authication for google and facebook
const google=require('./auth/google_login');
app.use('/login-google',google);

//authication for facebook
const facebook=require('./auth/facebook_login');
app.use('/login-facebook',facebook);

//authication self login and register
const login = require('./controllers/login');
app.use('/login-signup',login);

//mediatation music now
//meditation controllers
var musicRouter = require('./routes/music');
app.use('/music',musicRouter);

app.get('/config',(req,res)=>{
	res.json({
		bucketName:config.albumBucketName,
		bucketRegion:config.bucketRegion,
		bucketSecretkey:config.IdentityPoolId
	})
})
//app.use(app.router);
//google.initialize(app)
app.listen(3000,()=>{
	console.log('Server started on http://localhost:3000');
});

