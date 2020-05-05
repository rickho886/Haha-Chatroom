function initApp() {
    // Login with Email/Password
    var txtUsername = document.getElementById('UsernameArea');
    var txtEmail = document.getElementById('EmailArea');
    var txtPassword = document.getElementById('PasswordArea');
    var txtrepeatPassword = document.getElementById('repeatPasswordArea');
    var btnSignUp = document.getElementById('signupButton');
    
    btnSignUp.addEventListener('click', function() {
        if(txtUsername.value == "" || txtUsername.value.length > 21) {
            alert("Username cannot be empty or longer than 20 letters!");
            txtUsername.value = "";
        } else if(txtPassword.value == txtrepeatPassword.value && txtPassword.value != "") {
            var username_val = txtUsername.value;
            var email_val = txtEmail.value;
            var password_val = txtPassword.value;
            document.getElementById('loading').style.display = 'block';
            onReady();

            firebase.auth().createUserWithEmailAndPassword(email_val, password_val).then(function(result) {
                alert("You have successfully created the account!");
                var usersRef = firebase.database().ref('user_list/');
                usersRef.child(result.user.uid).set({
                    email: email_val,
                    username : username_val,
                    photo : "https://firebasestorage.googleapis.com/v0/b/haha-chatroom.appspot.com/o/4b353ab564805a4c6a0a7cea9168e753.jpg?alt=media&token=ad84ee33-5337-40eb-a86d-f386e5fc75fa"
                });
                txtUsername.value = "";
                txtEmail.value = "";
                txtPassword.value = "";
                txtrepeatPassword.value = "";
                return result.user.updateProfile({
                    displayName: username_val,
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/haha-chatroom.appspot.com/o/4b353ab564805a4c6a0a7cea9168e753.jpg?alt=media&token=ad84ee33-5337-40eb-a86d-f386e5fc75fa"
                })
                
            }).then(function() {
                document.location.href = "index.html";
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                txtUsername.value = "";
                txtEmail.value = "";
                txtPassword.value = "";
                txtrepeatPassword.value = "";
                // ...
            });
        } else {
            alert('Password not match or cannot be empty');
            txtPassword.value = "";
            txtrepeatPassword.value = "";
        }
    });
}

// Custom alert
/*
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}*/

function onReady() {
    var interval_delay = window.setInterval(checkReady, 3000);

    function checkReady() {
        if (document.getElementsByTagName('body') !== undefined) {
            window.clearInterval(interval_delay);
            document.getElementById('loading').style.display = 'none';
        }
    }
}

window.onload = function() {
    initApp();
};