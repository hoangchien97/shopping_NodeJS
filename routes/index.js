var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product');
var CategoryModel = require('../models/category');
var GioHang = require('../models/giohang');
var CartModel = require('../models/cart');


/* GET home page. */
router.get('/menu', function(req, res, next) {
  // res.send(req.user);
    CategoryModel.find().then(function(data){
      res.json(data);
      // res.render('site/product/index');
  })
});
router.get('/', function(req, res, next) {
  // san pham moi nhat
    ProductModel.find().sort({create_at:-1}).then(function(productNew){
      res.render('site/product/index',{productNew:productNew});
    })
  // })
});
router.get('/gioi-thieu', function(req, res, next) {
  res.render('site/page/about');
});
router.get('/lien-he', function(req, res, next) {
  res.render('site/page/contact');
});
// Chi tiet san pham
router.get('/san-pham/:slug', function(req, res, next) {
  ProductModel.find({slug:req.params.slug}).then(function(product){
    // console.log(product);
    var cat_id = product[0].cat_id;
    CategoryModel.findOne({id:cat_id}).then(function(category){
      // res.send(category);
      res.render('site/product/single-product',{product:product[0],category:category});
    })
  })
});
// the loai
router.get('/the-loai/:slug', function(req, res, next) {
    CategoryModel.findOne({slug:req.params.slug}).then(function(category){
      var cat_id = category.id;
      ProductModel.find({cat_id:cat_id}).then(function(product){
        // res.send(product);
        res.render('site/product/theloai',{category:category,product:product});
      })
      
    })
// })
});
router.get('/search/:txtSearch',function(req,res,next){
  console.log(req.query);
});


router.get('/gio-hang/:id',function(req,res,next){
  var id = req.params.id;
	var giohang = new GioHang(req.session.cart ? req.session.cart : {items : {}});

	ProductModel.findOne({'_id' : id}).then(function (product) {
    giohang.add(id,product);
    req.session.cart = giohang;
    // console.log(req.session.cart);
		res.redirect('/cart');
  });
})
router.get('/cart',function(req,res,next){
  if (!req.session.cart) {
    console.log("Gio hang rong");
		res.redirect('/');
	}
	var giohang = new GioHang(req.session.cart);
	if (Object.keys(giohang.items).length == 0) {
		res.redirect('/');
	} else {
    var data = giohang.convertArray()
    var count = Object.keys(giohang.items).length;
		res.render('site/cart/view_cart',{data : data,count:count});
	}
})
router.get('/update/:id/:qty',function (req, res, next) {
	var id = req.params.id;
	var qty = req.params.qty;
	var giohang = new GioHang(req.session.cart);
	giohang.update(id,qty);
	req.session.cart = giohang;
	res.send("Oke");
});
router.get('/delCart/:id',function(req,res,next){
  var id = req.params.id;
  var giohang = new GioHang(req.session.cart);// khởi tạo obj
  giohang.delete(id);// xóa obj
  req.session.cart = giohang;// cập nhật
  res.redirect('/cart');
});
router.get('/checkout_address',function(req,res,next){
  res.render('site/cart/checkout_address');
})
router.post('/checkout_address',function(req,res,next){
  req.checkBody('name',"Tên không được rỗng").notEmpty();
  var errors = req.validationErrors();
  if (errors) 
      res.send(errors);
})
router.get('/checkout_payment',function(req,res,next){
  res.render('site/cart/checkout_payment');
})
router.get('/checkout',function(req,res,next){
  res.render('site/cart/checkout');
})
module.exports = router;
