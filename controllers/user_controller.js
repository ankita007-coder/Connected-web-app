const { use } = require('passport');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// module.exports.profile = async function(req, res){
//     let users = await User.findById(req.params.id, function(err,user){
//         console.error(err);
//         return res.render('user_profile', {
//             title: 'User Profile',
//             profile_user: user
//     });
   
//     });
// } try catch is needed In your profile controller, you are using await with User.findById and passing a 
//callback function to it as well. This is causing User.findOne to get executed, which is causing the error.
//To fix this, you can remove the callback function and only use await with User.findById
module.exports.profile = async function(req, res){
    try {
        let user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        console.error(err);
        return res.redirect('/');
    }
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){

        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('multer error',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });


        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }


    }else{
            req.flash('error','Unauthorized');
            return res.status(401).send('Unauthorized');
        }


}



// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Connected| Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Connected | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req, res){
    
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','logged out');
        return res.redirect('/');
      });
}