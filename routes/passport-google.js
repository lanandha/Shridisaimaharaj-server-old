const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const User = require('../db/user');
const User = require('../models/google_db');
passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "910563901267-66quoscgin2pb7akuvfu90ecg6df5mve.apps.googleusercontent.com",//685419281743-si90p0b3o06u4io66c21lr8674r20fqa.apps.googleusercontent.com",
    clientSecret: "QZuUB4ba1ZVUYcjhhL9S0I8k",//9auVjhRyBhL2WfqR7ppsA256",
    callbackURL: "http://localhost:3000/google/callback"
  },
  //client id="685419281743-si90p0b3o06u4io66c21lr8674r20fqa.apps.googleusercontent.com";
  //client secret="9auVjhRyBhL2WfqR7ppsA256";
  function(accessToken, refreshToken, profile, done) {
    
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
     /*User.findOne({googleId: profile.id}, (err, user) => {
      if(err) {
        return done(err)
      }
      if(!user) {
        User.create({
          googleId: profile.id,
          name: profile.displayName
          }, (err, user) => {
            done(err, user);
          }
        );
      } else {
        done(err, user);
      }     
  });*/
  User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id,email:profile.emails[0].value,image:profile.photos[0].value/*,image:profile.photos*/ }, (err, user)=> {
         console.log('database saved');
         // return done(err, user);
       });
  
    return done(null, profile);
  }
));
module.export={passport};