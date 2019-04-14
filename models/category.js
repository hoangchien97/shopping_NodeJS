var mongoose = require('mongoose');
var slugify = require('slugify')
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Jakarta'
});

var CategorySchema = new Schema({
	id : {type : Number },
	name:  {type: String, required : true},
    parentId : {type:Number,require:true},
    slug : String,
    create_at : {type: Date, default : nDate}
},{collection : "category"});

module.exports = mongoose.model('Category',CategorySchema);