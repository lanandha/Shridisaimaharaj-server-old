const express = require('express');
const routes = express.Router();
//const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('../routes/passport-google');

//app.use(cors())

// parse application/x-www-form-urlencoded
routes.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
routes.use(bodyParser.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
routes.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
routes.use(passport.initialize());
routes.use(passport.session());

// Example protected and unprotected routes
routes.get('/', (req, res) => {
    res.send('Example google page!');
console.log('Example google page!');
    });
routes.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
routes.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

routes.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

routes.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
//app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))
module.exports=routes;