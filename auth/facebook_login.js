var router            = require('express').Router();
    //app                 = express(),
    var passport            = require('passport');
    var session             = require('express-session');
   require('../routes/passport-facebook');
 
 
// initialize passposrt and and session for persistent login sessions
router.use(session({
    secret: 'secret',//"tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
 
 
// route middleware to ensure user is logged in, if it's not send 401 status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
}
 
// home page
router.get("/", function (req, res) {
    res.send("Hello facebook login!");
    console.log("hello facebook login!");
});
 
// login page
router.get("/login", function (req, res) {
    res.send("<a href='login-facebook/auth/facebook'>login through facebook</a>");
});
 
 
// send to facebook to do the authentication
router.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
// handle the callback after facebook has authenticated the user
router.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/content",
        failureRedirect : "/"
}));
 
 
// content page, it calls the isLoggedIn function defined above first
// if the user is logged in, then proceed to the request handler function,
// else the isLoggedIn will send 401 status instead
router.get("/content", isLoggedIn, function (req, res) {
    res.send("Congratulations! you've successfully logged in.");
});
 
// logout request handler, passport attaches a logout() function to the req object,
// and we call this to logout the user, same as destroying the data in the session.
router.get("/logout", function(req, res) {
    req.logout();
    res.send("logout success!");
});
 
// launch the app
//app.listen(3000,()=>{ console.log("App running at localhost:3000");});
module.exports=router;