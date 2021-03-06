$(document).ready(function() {
    // ajax menu
    menu();
    update ();
    search();
});
function menu(){
    $.ajax({
        type: 'GET',
        url: '/menu',
        dataType: 'json',
        success: function (data) {
            var urlCurrent = window.location.pathname.split("/");
			var activeHome = '';
			if (window.location.pathname == '/') {
				activeHome = 'class="active"';
			}
            var xhtml = '<li '+activeHome+'><a href="/">Trang chủ</a></li>';
            $.each(data, function (key, item) { 
                var activeCategory = '';
                if (window.location.pathname == '/the-loai/' + data[key].slug) {
					activeCategory = 'class="active"';
				}
                if(data[key].parentId == 0){
                    var parentId = data[key].id;
                    xhtml += '<li '+activeCategory+'><a href="/the-loai/'+data[key].slug+'">'+ data[key].name +'</a>';
                    xhtml += '<div class="drodown-mega-menu" style="width:446px">';
                    xhtml += '<div class="left-mega col-xs-6">';
                    xhtml += '<div class="mega-menu-list">';
                    xhtml += '<ul>';
                $.each(data, function (key, item) { 
                    if(data[key].parentId == parentId)
                        xhtml += '<li '+activeCategory+'><a href="/the-loai/'+data[key].slug+'">'+ data[key].name +'</a></li>'; 
                });
                xhtml += '</ul>';
                xhtml += '</div>';
                xhtml += '</div>';
                xhtml += '</div>';
                xhtml += '</li>';
                }
            });
            // xhtml += '<li><a href="#">Delivery</a></li>';
            xhtml += '<li><a href="/gioi-thieu">Giới thiệu</a></li>';
            xhtml += '<li><a href="/lien-he">Liên hệ</a></li>';
            $(".mega-menu").html(xhtml);
        }
    });
}
function update () {
	$('input[name="qtybutton"]').change(function () {
        var id = $(this).attr('idsp');
		var qty = $(this).val();
		$.ajax({
			url: '/update/'+id+'/'+qty,
			type: 'GET',
			dataType: 'html',
			success:function (data) {
				if (data == "Oke") {
					location.reload();
				}
			}
		});
	});
}
function search(){
    $('#txtSearch').keyup(function(e){
        $('#result').html('');
        e.preventDefault();
        var txtSearch = $(this).val();
        var expression = new RegExp(txtSearch, "i");
        $.get('/search?txtSearch='+txtSearch,function(data){
            data.forEach(function(product){
                if (product.name.search(expression) != -1 || product.slug.search(expression) != -1)
                {
                    $('#result').append('<li class="list-group-item link-class"><a href="san-pham/'+product.slug+'"><img src="'+product.image+'" height="40" width="40" class="img-thumbnail" /> '+product.name+' </a></li>');
                }
            })
        })
    })
    $('#result').on('click', 'li', function() {
        var click_text = $(this).text().split('|');
        $('#txtSearch').val($.trim(click_text[0]));
        $("#result").html('');
    });
}
