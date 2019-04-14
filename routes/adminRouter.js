var express = require('express');
var AdminModel = require('../models/admin');
var CategoryModel = require('../models/category');
var ProductModel = require('../models/product');
var UserModel = require('../models/user');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var passportAdmin = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

/* GET users listing. */
// checkAuth : Xác thực người dùng đã login hay chưa
router.get('/', function(req, res, next) {
	// res.send('Admin' + req.user);
	// req.session.fullname = req.user.fullname;
	// res.json(req.user);
	UserModel.count().then(function(countUser){
		CategoryModel.count().then(function(countCate){
			ProductModel.count().then(function(countPro){
				res.render('backend/index',{title:'Dashboard',countUser : countUser, countCate : countCate, countPro : countPro});
			})
		})
	});
	// console.log(countUser);
  // 
});
router.get('/portfolio',checkAuth, function(req, res, next) {
	// res.send('Admin' + req.user);
	res.render('backend/admin/portfolio',{title:'Thông tin cá nhân',data:req.user});
});

router.get('/listUser', function(req, res, next) {
	// res.send('Admin' + req.user);
  res.render('backend/user/listUser');
});

passportAdmin.use('local',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
	},
	function(username, password, done) {
		// KT xem có tài khoản không ?
		AdminModel.getAdminByEmail(username,function(err,user){
			// nếu có lỗi => quăng lỗi
			if(err) throw err;
			// nếu không có tài khoản : Báo lỗi
			if(!user){
				return done(null,false,{message: 'Email không tồn tại !'});
			}
			// KT pass
			AdminModel.comparePass(password,user.password,function(err,isMath){
				// nếu có lỗi => quăng lỗi
				if(err) throw err;
				// đúng -> return về user
				if(isMath){
					return done(null, user);
				}else{
					return done(null,false,{message: 'Sai mật khẩu !'});
				}
			})
		})
	}
));
passportAdmin.serializeUser(function(email, done) {
	// console.log(email.id);
	done(null, email.id);
	// done(null, email.id); // Đây mới đúng
});

passportAdmin.deserializeUser(function(id, done) {
	AdminModel.getAdminById(id,function(err,email){
		done(err,email);
	})
});
function checkAuth(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/admin/login');
	}
}

router.get('/login', function(req, res, next) {
	res.render('backend/admin/login',{errors: null});
});
router.post('/login',
	passportAdmin.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/admin/login',
                                   failureFlash: true })
);

router.get('/register', function(req, res, next) {
  res.render('backend/admin/register',{errors:null});
});
router.post('/register', function(req, res, next) {
  req.checkBody('email','Invalid email address').isEmail();
  req.checkBody('fullname','Fullname is invalid').notEmpty().trim();
  req.checkBody('address','Address is invalid').notEmpty().trim();
  req.checkBody('password','Password must be at least 5 chars long').isLength({ min: 5 });
	req.checkBody('password','Password confirmation is incorrect').equals(req.body.password_confirmation);
	// res.render('register');
	var errors = req.validationErrors();
	if (errors) {
		// res.send(errors);
      res.render('backend/admin/register',{errors:errors});
  }else{
		var newAdmin = new AdminModel({
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
			address: req.body.address,
		});

		AdminModel.getAdminByEmail(newAdmin.email,function(err,user){
			if(user){
				req.flash('error_msg','Email đã tồn tại !');
				res.redirect('/admin/register');
			}else{
				AdminModel.createAdmin(newAdmin);
				// console.log(newAdmin);
				req.flash('success_msg','Đăng ký thành công !');
				res.redirect('/admin/login');
			}
		})
	}
});
router.get('/logout', function(req, res){
	req.logout();
  res.redirect('/admin/login');
});

module.exports = router;
