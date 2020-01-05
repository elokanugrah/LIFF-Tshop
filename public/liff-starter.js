window.onload = function() {
    const useNodeJS = true;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    displayLiffData();
    displayIsInClientInfo();
    displayClientProfile();
    registerButtonHandlers();
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').classList.add('hidden');
    } else {
        document.getElementById('liffLogoutButton').classList.add('hidden');
    }
}
 
/**
* Display data generated by invoking LIFF methods
*/
function displayLiffData() {
    document.getElementById('isInClient').textContent = liff.isInClient();
    document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
}
 
/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in the in-app browser of LINE.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in an external browser.';
    }
}

function displayClientProfile() {
    liff.getProfile().then(function(profile) {
        dispName = profile.displayName;
        document.getElementById('nickname').textContent = "Hai, " + dispName;
        document.getElementById("profileImage").src = profile.pictureUrl;
    }).catch(function(error) {
        document.getElementById('nickname').textContent = "";
    });
}

/**
* apabila kita klik tombol open window, maka method liff.openWindow() akan dijalankan. Isi parameter url dengan Endpoint URL aplikasi web yang sudah 
  Anda deploy di Heroku atau lainnya. Sedangkan jika parameter external diisi dengan nilai true maka URL di jalankan pada external browser. 
  Namun, jika diisi dengan nilai false maka URL akan dibuka pada browser LINE.
*/
function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://app-cart-tshop.herokuapp.com/', // Isi dengan Endpoint URL aplikasi web Anda
            external: true
        });
    });

/**
* Pada saat pengguna klik tombol close, script akan mengecek kondisi apakah pengguna membuka aplikasi LIFF pada LINE atau eksternal browser. 
  Apabila dijalankan di LINE maka aplikasi akan tertutup. Namun, apabila tidak dijalankan di LINE maka Alert Notification akan tampil.
*/
    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });
/**
* Baik login dan logout pada kode di bawah digunakan apabila kita membuka aplikasi LIFF pada eksternal browser. Apabila kita membuka aplikasi LIFF pada LINE 
  maka fitur tersebut tidak akan dijalankan. Dalam kode di bawah dijelaskan bahwa apabila klik tombol login maka secara otomatis akan mengecek apakah pengguna 
  sudah masuk menggunakan akun LINE atau belum. Apabila belum login maka pengguna diharuskan login terlebih dahulu yang kemudian akan di redirect menuju aplikasi 
  lagi apabila login sukses. Sedangkan untuk dapat menggunakan logout, akan dicek kembali apakah pengguna sudah dalam posisi masuk dengan akun LINE (atau belum). 
  Kalau sudah login sebelumnya, maka pengguna dapat logout akun LINE.
*/
    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
 
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });

    document.getElementById('checkout').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            if (!liff.isInClient()) {
                // sendAlertIfNotInClient();
                totalCartModal.innerHTML='<label>Total Belanja Anda : '+formatRupiah(total)+'  </label><br><br><br>'; 
                document.getElementById("checkout").setAttribute("data-toggle", "modal");
                document.getElementById("checkout").setAttribute("data-target", "#exampleModalCenter");
    
                document.getElementById('exampleModalCenterTitle').textContent = "Hai, " + dispName;
                document.getElementById('cartModal-text').textContent = "Terima kasih telah berbelanja di TShop. Berikut adalah keranjang belanjaan yang harus anda lunasi: ";
                
                if (mycart.length > 0) {
                    mycart.splice(0,mycart.length);
                    showCart();
                    saveCart();
                }
    
            } else {
                document.getElementById("checkout").removeAttribute("data-toggle");
                document.getElementById("checkout").removeAttribute("data-target");
    
                var num = 0;
                var chat_message = "Hai "+ dispName +",\nTerima kasih telah berbelanja di TShop \nBerikut keranjang belanjaan yang harus anda lunasi: \n\n";
                for (i in mycart) {
                    var item = mycart[i];
                    num++;
                    chat_message +=
                        'No. ' + num + ' \n' +
                        'Nama Produk: ' + item.Nama + ' \n' +
                        'Jumlah: ' + item.Qty + ' \n' +
                        'Harga: ' + formatRupiah(item.Price) + ' \n';
                    chat_message += '\n';
                }
                chat_message += 'Total belanja \n' + formatRupiah(total);
                liff.sendMessages([{
                    'type': 'text',
                    'text': chat_message
                }]).then(function() {
                    if (mycart.length > 0) {
                        mycart.splice(0,mycart.length);
                        showCart();
                        saveCart();
                        liff.closeWindow();
                    }
                    console.log('message sent');
                }).catch(function(error) {
                    console.log('error', error);
                });
            }
        } else {
            alert('Mohon login terlebih dahulu sebelum checkout');
        }
        
    });
}

/**
* Function sendAlertIfNotInClient berguna untuk menampilkan pesan di layar yang menandakan aplikasi LIFF 
  tidak mendukung eksternal browser. Sedangkan function toggleElement digunakan untuk beralih dari satu elemen ke elemen yang lainnya.
*/

function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}