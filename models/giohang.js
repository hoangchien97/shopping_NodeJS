function GioHang(oldCart) {
  this.items = oldCart.items || {};

	this.add = function (id,item) {
		var cartItem = this.items[id];
		if (!cartItem) {
			cartItem = this.items[id] = { item: item, soluong: 0}
		}
		cartItem.soluong++;
  }
  this.convertArray = function () {
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
  }
  this.update = function (id,sl) {
		var cartItem = this.items[id];
		var quantity;
		if (sl <= 0) {
			quantity = 1;
		} else if (sl > 10) {
			quantity = 10;
		} else {
			quantity = sl
		}
		cartItem.soluong = quantity;
	}
	this.delete = function(id){
		// delete : lệnh delete 1 obj
		delete this.items[id];
	}
}

module.exports = GioHang;