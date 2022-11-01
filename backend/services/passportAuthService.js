const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require("dotenv");
const users = require("../models/userModel");

dotenv.config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8800/auth/google/callback',
    passReqToCallback   : true
  }, async function (request, accessToken, refreshToken, profile, done) {
    let user;
    try{
      const existingUser = await users.findOne({gID: profile.id});
      if(!existingUser){
        const userData = { 
          gID: profile.id,
          firstName: profile.given_name,
          lastName: profile.family_name,
          verified: profile.verified,
          email: profile.email,
          picture: profile.picture
        }
        const newUser = await users.create(userData);
        user = newUser;
      }
      else{
        console.log("existingUser")
        user = existingUser;
      }
      return done(null, user);
    }
    catch(err){
      return done(err, user);
    } 
  }
  )
);

passport.serializeUser( (user, done) => {
    done(null, user);
});
passport.deserializeUser( (user, done) => {
    done(null, user);
});
