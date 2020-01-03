var mycart = [];
  var data_app = "";
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
            if ( window.localStorage)
            {
                localStorage.mycart = JSON.stringify(mycart);
            }
        }

        function showCart() {
          if (mycart.length == 0) { //cek nilai mycart, jika kosong maka hidden div dengan id cart
                $("#cart").css("visibility", "hidden");
                data_app = "";
                return;
          }

          $("#cart").css("visibility", "visible"); // jika tersedia maka tampilkan 

          data_app = '<table class="table table-striped table-dark">';
            data_app += '<thead>' +
                '<th>Nama Produk</th>' +
                '<th>Jumlah</th>' +
                '<th>Harga</th>' +
                '<th>Hapus</th>' +
                '</thead> <tbody>';
 
            for (i in mycart) {
                var item = mycart[i];
                data_app += '<tr>';
                data_app +=
                    '<td>' + item.Nama + ' </td>' +
                    '<td>' + item.Qty + ' </td>' +
                    '<td>' + formatRupiah(item.Price) + ' </td>' +
                    '<td><button class="btn btn-danger btn-circle" onclick="deleteItem(' + i + ')"><i class="fa fa-trash"  > </i></button></td>';
                data_app += '</tr>';
            }
 
            data_app += '</tbody></table>';
            $('#cart-body').html(data_app);

          for (var i in mycart) { //tampilkan data dari local storage mycart, template bisa anda sesuaikan
            var item = mycart[i];
            var row = '<div class="media"><div class="media-left media-top"></div><div class="media-body"><div class="col-lg-12"><div class="col-lg-10"><p>Nama Product <span style="padding-left:0.8em">: </span>'
                        + item.Nama +'</p><p>Jumlah <span style="padding-left:4em">:</span> '+ item.Qty +'</p><p>Harga <span style="padding-left:4.5em">:</span> '+ formatRupiah(item.Price) +'</p></div><div class="col-lg-2"><br><button class="btn btn-danger btn-circle" onclick="deleteItem(' 
                              + i + ')"><i class="fa fa-trash"  > </i></button></div></div></div></div><hr>' ;
          }

          // untuk total
          var total = 0;
          for(var i = 0; i < mycart.length; i++) {
              total += mycart[i].Subtotal; //jumlahkan keseluruhan row subtotal dari mycart untuk mendapatkan total
          }
          totalCart.innerHTML='<label>Total Belanja Anda : '+formatRupiah(total)+'  </label><br><br><br>'; 
          //isikan div dengan id totalcart dengan nilai diatas
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

        /*Scroll to top when arrow up clicked BEGIN*/
        $(window).scroll(function() {
            var cartTarget = document.getElementById("cart");;
            if (window.scrollY > (cartTarget.offsetTop + cartTarget.offsetHeight)) {
                $('#gotoCart').fadeOut();
            } else {
                $('#gotoCart').fadeIn();
            }
        });