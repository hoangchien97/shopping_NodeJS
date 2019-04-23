var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product');
var CategoryModel = require('../models/category');
var expressValidator = require('express-validator');

var dongho = function () {
	var t = new Date();
	var ngay = t.getDate();
	var thang = t.getMonth()+1;
	var nam = t.getFullYear();
	var gio = t.getHours();
	var phut = t.getMinutes();
	var giay = t.getSeconds();
	var thoigian = gio + ' : ' + phut + ' : ' + giay + ' - ' + ngay +' / ' + thang +' / ' + nam;
	return thoigian;
	setTimeout('dongho()', 1000);
}

var multer  = require('multer');
// upload file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname );
    cb(null, file.originalname );
  }
})
// function check có là file ảnh không ?
function extFile(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)){
        return cb(new Error('Chỉ nhận file ảnh !'));
    }else{
        cb(null,true);
    }
}

var upload = multer(
    { storage: storage, fileFilter: extFile}
    );
// hàm chuyển không dấu
function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    return str;
}


router.get('/listProduct',function(req,res,next){
    ProductModel.find().sort({create_at:-1}).then(function(product){
        CategoryModel.find().then(function(category){
            // res.send(category);
            res.render('backend/product/listProduct',{title:'Danh sách sản phẩm',product:product,category:category});
	    })
    }) 
})
router.get('/addProduct',function(req,res,next){
    CategoryModel.find({parentId: {$ne: 0}}).then(function(category){ // $ne : not equals
        // res.send(category);
        res.render('backend/product/addProduct',{
            title:"Thêm sản phẩm",
            category:category,
            errors:null
        });
    })
})
router.post('/addProduct',upload.any(),function(req,res,next){
    // res.send(req.files);
    var pathImg = 'uploads/'+req.files[0].originalname;
    // res.send(path);
    req.checkBody('txtName', 'Giá Trị không được rỗng').notEmpty();
    req.checkBody('txtDescription', 'Chi tiết sản phẩm 5 đến 32 ký tự').isLength({min:3, max:32});
    req.checkBody('sltSize', 'Kích thước không được để trống').notEmpty();
    req.checkBody('txtQuantity', 'Giá 5 đến 10 ký tự').isLength({min:0, max:10}).isNumeric();
    var errors = req.validationErrors();
	if (errors) {
        CategoryModel.find({parentId: {$ne: 0}}).then(function(category){ // $ne : not equals
            // res.send(category);
            res.render('backend/product/addProduct',{
                title:"Thêm sản phẩm",
                category:category,
                errors:errors
            });
        })
    }else{
        var slug = bodauTiengViet(req.body.txtName);
        var data = {
            'name' : req.body.txtName,
            'image' : pathImg,
            'description' : req.body.txtDescription,
            'size' : req.body.sltSize,
            'slug' : slug,
            'quantity' : req.body.txtQuantity,
            'price' : req.body.txtPrice,
            'cat_id' : req.body.sltCategory,
            'status' : req.body.rdoStatus,
        }
        var newProduct = new ProductModel(data);
        newProduct.save();
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('/admin/product/listProduct');
    }
})
router.get('/delProduct/:id',  function (req, res,next) {
    var id = req.params.id;
	ProductModel.findById(id, function(err, data){
		var file = './public/' + data.image;
		var fs = require('fs');
		fs.unlink(file, function(e){
			if(e) throw e;
		 });
		data.remove(function(){
			req.flash('success_msg', 'Đã Xoá Thành Công');
			res.redirect('/admin/product/listProduct');
		})
    });
});
router.get('/editProduct/:id',function(req,res,next){
    var id = req.params.id;
    ProductModel.find({_id:id}).then(function(product){
        // var cat_id = product[0].cat_id;
        // console.log(cat_id);
        CategoryModel.find({parentId: {$ne: 0}}).then(function(category){ // $ne : not equals
            // res.send(category);
            res.render('backend/product/editProduct',{
                title:"Sửa sản phẩm",
                product:product[0],
                category:category,
                errors:null
            });
        })
    })  
})
router.post('/editProduct/:id',upload.single('fileImg'),function(req,res,next){
    var id = req.params.id;
    // var pathImg = './public/uploads/'+req.file.filename;
    // console.log(pathImg);
    var pathImg;
    req.checkBody('txtName', 'Giá Trị không được rỗng').notEmpty();
    var errors = req.validationErrors();
	if (errors) {
        // Nếu có lỗi . xóa file ảnh vừa upload
        var file = './public/uploads/'+req.file.filename;
		var fs = require('fs');
		fs.unlink(file, function(e){
			if(e) throw e;
         });
        // Quay trở về trang sửa
        ProductModel.find({_id:id}).then(function(product){
            CategoryModel.find({parentId: {$ne: 0}}).then(function(category){ // $ne : not equals
                // res.send(category);
                res.render('backend/product/editProduct',{
                    title:"Sửa sản phẩm",
                    product:product[0],
                    category:category,
                    errors:errors
                });
            })
        })
    }else{
        if(req.file){
            pathImg = './uploads/'+req.file.filename;
        }else{
            ProductModel.find({_id:id}).then(function(product){
                pathImg = product.image;
            })
        }
        ProductModel.findOne({ _id: id}, function(err, data){
			var file = './public/' + data.image;
			var fs = require('fs');
			fs.unlink(file, function(e){
				if(e) throw e;
            });
            var slug            = bodauTiengViet(req.body.txtName);
			data.name 			= req.body.txtName;
            data.image          = pathImg;
            data.description    = req.body.txtDescription;
            data.size           = req.body.sltSize;
            data.slug           = slug;
            data.quantity       = req.body.txtQuantity;
            data.price          = req.body.txtPrice;
            data.cat_id         = req.body.sltCategory;
            data.status        = req.body.rdoStatus;
            console.log(data);
			data.save();
			req.flash('success_msg', 'Đã Sửa Thành Công');
			res.redirect('/admin/product/listProduct');
		});
    }
})
router.get('/detailProduct/:id',function(req,res,next){
    var id = req.params.id;
    ProductModel.findById(id).then(function(product){
        res.render("backend/product/detailProduct",{title:"Chi tiết sản phẩm",product:product});
    // })
    })
})

module.exports = router;
