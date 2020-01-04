var mycart = [];
var total = 0;
var qty_total = 0;
var data_app = "";
var dispName = "";
$(function () {
    if (localStorage.mycart)
    {
        mycart = JSON.parse(localStorage.mycart);
        showCart();
    }
});


// mengambil data button ketika button dengan class add di click
$('.add').click(function(){

var id   = $(this).data("id");
var nama   = $(this).data("nama");
var qty   = $(this).data("qty");
var price   = $(this).data("price");
var subtotal = price * qty;
addToCart(id,nama,qty,price,subtotal);   //kirimkan nilai ke fungsi addToCart, berhati - hati penggunaan inserting data usahakan serverside process, ini hanya untuk pembelajaran

})

function addToCart(id,nama,qty,price,subtotal) {
    //cek data in cart then update qty
    for (var i in mycart) {
        if(mycart[i].Id == id)
        {
            //jika data available then
            mycart[i].Qty = mycart[i].Qty+qty;
            mycart[i].Subtotal = subtotal * mycart[i].Qty;
            showCart(); //panggil fungsi showCart
            saveCart(); // panggil fungsi saveCart untuk insert data
            return;
            
        }
    
    }


    // jika tidak ada insert all

    var item = { Id: id, Nama:nama, Qty:qty, Price:price, Subtotal:subtotal}; 
    mycart.push(item);
    saveCart();
    showCart();
}

function deleteItem(index){
    mycart.splice(index,1); // hapus item berdasarkan index
    showCart();
    saveCart();
}

function saveCart() {
    if (window.localStorage)
    {
        localStorage.mycart = JSON.stringify(mycart);
    }
}

function showCart() {
    if (mycart.length == 0) { //cek nilai mycart dan localStorage mycart, jika kosong maka hidden div dengan id cart
        $("#cart").css("visibility", "hidden");
        data_app = "";
        $('#gotoCart').fadeOut();
        $('.cart-quantity').html('0');
        return;
    }

    $("#cart").css("visibility", "visible"); // jika tersedia maka tampilkan 

    data_app = '<div class="table-responsive"><table class="table table-striped">';
    data_app += '<thead class="thead-dark">' +
        '<th>Nama Produk</th>' +
        '<th>Jumlah</th>' +
        '<th>Harga</th>' +
        '<th class="text-center">Hapus</th>' +
        '</thead> <tbody>';

    for (i in mycart) {
        var item = mycart[i];
        data_app += '<tr>';
        data_app +=
            '<td>' + item.Nama + ' </td>' +
            '<td>' + item.Qty + ' </td>' +
            '<td>' + formatRupiah(item.Price) + ' </td>' +
            '<td class="table-danger" align="center"><button class="btn btn-danger btn-circle btn-small" onclick="deleteItem(' + i + ')"><i class="fa fa-trash"  > </i></button></td>';
        data_app += '</tr>';
    }

    data_app += '</tbody></table></div>';
    $('#cart-body').html(data_app);

    
total = 0;
qty_total = 0;
    for(var i = 0; i < mycart.length; i++) {
        total += mycart[i].Subtotal; //jumlahkan keseluruhan row subtotal dari mycart untuk mendapatkan total
        qty_total += mycart[i].Qty; //jumlahkan keseluruhan row Qty dari mycart untuk mendapatkan Qty
    }
    totalCart.innerHTML='<label>Total Belanja Anda : '+formatRupiah(total)+'  </label><br><br><br>'; 
    $('#gotoCart').fadeIn();
    $('.cart-quantity').html(qty_total);
}

function formatRupiah(amount) {
    var	number_string = amount.toString(),
    sisa 	= number_string.length % 3,
    rupiah 	= number_string.substr(0, sisa),
    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return 'Rp' + rupiah;
}