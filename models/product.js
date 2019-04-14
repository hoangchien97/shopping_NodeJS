var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});
var ProductSchema = new Schema({
	// id : {type : Number },
	name: {type: String, required : true},
    image: {type: String, required : false},
	description: {type: String, required : true},
    size : String,
    slug : String,
    quantity : {type: Number,required:true},
	price: {type: Number,required:true},
	cat_id : Number,
    status : {type : Number , default : 1},
    create_at : {type: Date, default : nDate}
},{collection : "product"});

module.exports = mongoose.model('Product',ProductSchema);