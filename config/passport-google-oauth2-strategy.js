const passport = require('passport');
const googleStrategy = require('passport-google-strategy').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');
//tell the passport to use a new strategy for google authentication
passport.use(new googleStrategy({
    clientID: "919048359936-1rr0jg1u1t60javu5viobus98so27u76.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://localhost:8000/users/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value})
        .exec(function(err, user){
            if(err){
                console.log('error in google strategy passport',err);
                return;
            }
            console.log(profile);
            if(user){
                //if found set this user as req.user
                return done(null, user);
            }
            else{
                //if not found, create a new one and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.email[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err, user){
                    if(err){
                        console.log('error in google strategy passport',err);
                        return;
                    }
                    return done(null,user);
                })
            }
        })
    }
));

module.exports = passport;