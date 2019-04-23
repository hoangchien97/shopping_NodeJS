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
// router.get('/', function(req, res, next) {
//     ProductModel.find().sort({create_at:-1}).then(function(productNew){ // san pham moi nhat
//       res.render('site/product/index',{productNew:productNew});
//     })
// });

router.get('/', function(req, res, next) {
  ProductModel.find().sort({create_at:-1}).then(function(productNew){ // san pham moi nhat
    // Dùng để liên kết join bảng
    CategoryModel.aggregate([
      {$lookup: {
          from: 'product',
          localField: 'id',
          foreignField: 'cat_id',
          as: 'productList'
      }},
      {$match: {parentId:{$ne:0}}} // lọc có parentId : 0
      ]
    ).then(function(product){
      // console.log(product);
      res.render('site/product/index',{productNew:productNew,product:product});
    });
  })
});

router.get('/gioi-thieu', function(req, res, next) {
  res.render('site/page/about');
});
router.get('/lien-he', function(req, res, next) {
  res.render('site/page/contact');
});
// Chi tiet san pham
router.get('/san-pham/:slug', function(req, res, next) {
  var slug = req.params.slug;
  ProductModel.find({slug:slug}).then(function(product){ // chi tiết sản phẩm
    // console.log(product);
    var cat_id = product[0].cat_id;
    
    // viewed
    
    if(!req.session.viewed){
      req.session.viewed = [];
    }
    if(req.session.viewed.indexOf(slug)== -1){ // tránh lưu 2 lần viewed
      req.session.viewed.push(slug);
    }

    CategoryModel.findOne({id:cat_id}).then(function(category){
      // res.send(category);
      ProductModel.find().then(function(productAll){
        res.render('site/product/single-product',{product:product[0],category:category,viewed:req.session.viewed,productAll:productAll});
      })
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
router.get('/search',function(req,res,next){
  // console.log(req.query.txtSearch);
  var txtSearch = '.*'+req.query.txtSearch+'.*';
  // console.log(txtSearch);
  // LIKE
  if(req.query.txtSearch){
    ProductModel.find({'name': {$regex: txtSearch}},function(err,product){
      if(err) console.log(err);
      res.json(product);
    })
  }
  // else{
  //   ProductModel.find({},function(err,product){
  //     if(err) console.log(err);
  //     else {
  //       if(req.xhr){ // If req was made with AJAX
  //           res.json(product); // send back all todos as JSON
  //       } else {
  //           res.render("site/product/index", {product: product}); // otherwise render the index view
  //       }
  //     }
  //   })
  // }
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
