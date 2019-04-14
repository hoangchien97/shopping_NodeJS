var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});
var AdminSchema = new Schema({
	email : {type :String , require : true , trim : true},
	password : {type : String, require:true},
	fullname : String,
    address : String,
	created_at : { type : Date , default : nDate}
}, {collection : "admin"});
var Admin = module.exports = mongoose.model('Admin',AdminSchema);

module.exports.getAdminByEmail = function(email,callback){
	var query = {email:email};
	Admin.findOne(query,callback);
}
module.exports.createAdmin = function(newAdmin){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newAdmin.password, salt, function(err, hash) {
			newAdmin.password = hash;
			newAdmin.save();
		});
	});
}
module.exports.comparePass = function(pass,hash,callback){
	bcrypt.compare(pass, hash, function(err, isMath) {
    // res === true
    	if(err) throw err;
    	callback(null,isMath);
	});
}

module.exports.getAdminById = function(id,callback){
	Admin.findById(id,callback);
}