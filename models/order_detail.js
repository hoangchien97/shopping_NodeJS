var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});

var OrderDetailSchema = new Schema({
	order_id : {type : Number , default : 1},
    product_id : int,
	quantity: Number,
    price: Number,
    create_at : {type: Date, default : nDate}
},{collection : "order_detail"});

module.exports = mongoose.model('Order_Detail',OrderDetailSchema);