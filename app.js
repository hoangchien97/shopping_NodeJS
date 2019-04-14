var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// session khai báo sau cookie
var session = require('express-session');
// flash phải khai báo sau session
var flash = require('connect-flash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
// Khai báo passport để login
var passport = require('passport');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/adminRouter');
var userRouter = require('./routes/userRouter');
var productRouter = require('./routes/productRouter');
var categoryRouter = require('./routes/categoryRouter');
var cart = require('./routes/cart');


mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Khai báo khi dùng connect-flash
app.use(session({
  secret: 'HoangChien',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(flash());
app.use(function(req,res,next){
  res.locals.cart = req.session.cart;
  next();
})
app.use(passport.initialize());
app.use(passport.session());

// Luôn đặt trước Router. // fix lỗi check is not a function
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift()
    }
    return{
        param: formParam,
        msg: msg,
        value: value
    };
  }
}));

app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use(userRouter);
app.use('/admin/product',productRouter);
app.use('/admin/category',categoryRouter);
app.use('/cart',cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
