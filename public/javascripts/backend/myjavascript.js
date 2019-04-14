$(document).ready(function() {	
    // view
    $(document).on('click','.modal_view',function(){
        var product_id = $(this).attr('id');
        // alert(product_id);
        $.ajax({
            type: "get",
            url: "/admin/product/detailProduct/"+product_id,
            dataType: "html",
            success: function (data) {
                $('#product_detail').html(data);
                $('#modal_view').modal('show'); // show Modal View
            }
        });
    });
});