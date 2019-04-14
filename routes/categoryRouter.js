var express = require('express');
var router = express.Router();
var CategoryModel = require('../models/category');
var expressValidator = require('express-validator');

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

router.get('/listCategory',function(req,res,next){
    CategoryModel.find({parentId: {$ne : 0}}).then(function(category){
        res.render('backend/category/listCategory',{title:'Danh sách thể loại',category:category});
    })
})
// view man hinh them the loai
router.get('/addCategory',function(req,res,next){
    CategoryModel.find({parentId: {$ne : 0}}).then(function(category){
        res.render('backend/category/addCategory',{title:'Thêm thể loại',errors:null});
    })
})
router.post('/addCategory',function(req,res,next){
    CategoryModel.find().sort({id:-1}).limit(1).then(function(cate){
        var idMax = cate[0].id; // max
        // console.log(idMax);
        req.checkBody('txtName', 'Giá Trị không được rổng').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            // res.send(errors);
            res.render('backend/category/addCategory',{title:'Thêm thể loại',errors : errors}); 
        }else{
        var slug = bodauTiengViet(req.body.txtName);
        var data = {
            'id' : idMax+1,
            'name' : req.body.txtName,
            'slug' : slug,
            'parentId' : req.body.sltParentId
        }
        // console.log(data);
        var newCategory = new CategoryModel(data);
        newCategory.save();
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('/admin/category/listCategory'); 
        }
    })
})
router.get('/editCategory/:id',function(req,res,next){
    CategoryModel.findById(req.params.id, function(err, data){
        res.render('backend/category/editCategory',{ errors: null, data: data,title:"Sửa thể loại"});
        // res.send(data);
	});	
})
router.post('/editCategory/:id',function(req,res,next){
    var id = req.params.id;
    req.checkBody('txtName', 'Giá Trị không được rổng').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        // res.render('backend/category/addCategory',{title:'Thêm thể loại',errors : errors}); 
    }else{
        res.send("ahihi");
    }
});
router.get('/delCategory/:id',function(req,res,next){
    // console.log(req.params.id);
    CategoryModel.findByIdAndRemove(req.params.id).exec();
    // res.flash('success_msg','Đã xóa thành công');
    res.redirect('/admin/category/listCategory');
})
module.exports = router;