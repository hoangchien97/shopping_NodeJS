var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});
var UserSchema = new Schema({
	id : Number,
	email : {type :String , require : true , trim : true},
	password : {type : String, require:true},
    fullname : String,
    image: String,
    gender : String,
    birthday : Date,
    address : String,
	created_at : { type : Date , default : nDate}
}, {collection : "user"});
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserByEmail = function(email,callback){
	var query = {email:email};
	User.findOne(query,callback);
}
module.exports.createUser = function(newUser){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save();
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

module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}