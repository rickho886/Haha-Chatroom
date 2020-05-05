function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('EmailArea');
    var btnReset = document.getElementById('resetButton');

    
    btnReset.addEventListener('click', function() {
        document.getElementById('loading').style.display = 'block';
        firebase.auth().sendPasswordResetEmail(txtEmail.value).then(function() {
            alert("Reset Success!");
            onReady();
            txtEmail.value = "";
            document.location.href = "index.html";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            onReady();
            txtEmail.value = "";
            // ...
        });
    });
}

function onReady() {
    var interval_delay = window.setInterval(checkReady, 100);

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