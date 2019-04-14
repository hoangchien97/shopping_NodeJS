var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});

var CustomerSchema = new Schema({
	email : {type :String , require : true , trim : true},
	password : String,
	fullname : String,
	phone : String,
    birthday : String,
    gender : String,
    address : String,
	created_at : { type : Date , default : nDate}
}, {collection : "customer"});

var Customer = module.exports = mongoose.model('Customer',CustomerSchema);

module.exports.createCustomer = function (customerNew) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(customerNew.password, salt, function(err, hash) {
	    	customerNew.password = hash;
	        customerNew.save(); 
	    });
	});
}

module.exports.getCustomerByEmail = function (email,callback) {
	var query = {email : email};
	Customer.findOne(query,callback);
}

module.exports.comparePass = function(pass,hash, callback){
	bcrypt.compare(pass,hash,function(err,res){
		if(err)	throw err;
		callback(null,res);
	})
};

module.exports.getUserById = function (id, callback) {
	Customer.findById(id, callback);
}
module.exports = mongoose.model('Customer',CustomerSchema);