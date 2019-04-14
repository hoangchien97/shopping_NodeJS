var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});
var OrderSchema = new Schema({
	id : {type : Number , default : 1},
	name: {type: String, required : true},
	address: String,
	phone: String,
    email : {type :String , require : true , trim : true},
    status : {type : Boolean,default:false},
    payment_method : String,
    total : Number,
    cus_id : Number,
    create_at : {type: Date, default : nDate}
},{collection : "order"});

module.exports = mongoose.model('Order',OrderSchema);