var Product = require('../models/product');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true})

var products = [
    new Product({
        id : 1,
        name: Áo sơ mi kẻ caro,
        image: "",
        description: "", 
        slug : slugify(name,'-'),
        quantity : 3,
        price: 100000,
        cat_id : 1,
        status : 1
    }),
    new Product({
        id : 2,
        name: Quần âu,
        image: "",
        description: "", 
        slug : slugify(name,'-'),
        quantity : 3,
        price: 100000,
        cat_id : 1,
        status : 1
    })
];
var done = 0;
for(var i=0;i<products.length;i++){
    products.save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
