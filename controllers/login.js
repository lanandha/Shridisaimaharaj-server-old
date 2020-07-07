var express = require('express');
//var ejs = require('ejs');
var path = require('path');
//var app = express();
var router =express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost:27017/ManualAuth');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

router.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//app.set('views', path.join(__dirname, 'views'));
//router.set('view engine', 'ejs');	

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//router.use(express.static(__dirname + '/views'));

var index = require('../routes/login');
router.use('/login', index);
router.get('/', (req, res) =>{
 res.send('Example login page!');
console.log("Example to login page!")
});

// catch 404 and forward to error handler
router.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
router.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
//app.listen(3000, function () { console.log('Express app listening on port 3000'); });
module.exports=router;