var express = require('express');
var UserModel = require('../models/user');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var router = express.Router();

/* GET users listing. */

router.get('/login', function(req, res, next) {
  res.render('site/user/login');
});
router.get('/register', function(req, res, next) {
  res.render('site/user/register');
});


passport.use('facebook',new FacebookStrategy({
  clientID: "2614674928606938", //FACEBOOK_APP_ID
  clientSecret: "1452d680df8bb8897895cd8c437070f6",//FACEBOOK_APP_SECRET
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email','locale', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile); // Kiểm tra dữ liệu
    // Kiểm tra người dùng có trong db chưa?
    UserModel.findOne({id:profile._json.id}, function(err, user) {
      // console.log(user);
      if (err) { return done(err); }
      if(user) { 
        done(null, user); 
      }else{
        const newUser = new UserModel({
          id : profile._json.id,
          email : profile._json.email,
          fullname : profile._json.name,
          gender : profile.gender,
        })
        newUser.save();
      }
    });
  }
));
passport.serializeUser(function(user, done) {
  // console.log(user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	UserModel.getUserById(id,function(err,user){
    // console.log();
		done(err,user);
	})
});
// function checkAuth(req,res,next){
// 	if(req.isAuthenticated()){
// 		next();
// 	}else{
// 		res.redirect('/');
// 	}
// }
router.get('/auth/facebook',
  passport.authenticate(
    'facebook',
    { authType: 'reauthenticate',
      scope: ['user_friends', 'manage_pages','email'] 
    }
  )
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


module.exports = router;
