function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('EmailArea');
    var txtPassword = document.getElementById('PasswordArea');
    var btnLogin = document.getElementById('loginButton');
    var btnGoogle = document.getElementById('googleButton');
    var btnGithub = document.getElementById('githubButton');
    var flag = 0;

    btnLogin.addEventListener('click', function() {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()" and clean input field
        document.getElementById('loading').style.display = 'block';
        firebase.auth().signInWithEmailAndPassword(txtEmail.value, txtPassword.value).then(function() {
            onReady();
            document.location.href = "chat.html";
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            //create_alert("error", errorMessage);
            onReady();
            alert(errorMessage);
            txtEmail.value = "";
            txtPassword.value = "";
        });
        
        

    });

    btnGoogle.addEventListener('click', function() {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()"
        var provider = new firebase.auth.GoogleAuthProvider();
        document.getElementById('loading').style.display = 'block';
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var curUser = firebase.auth().currentUser;
            var usersRef = firebase.database().ref('user_list/');
            notifyMe();
            usersRef.child(curUser.uid).set({
                email: curUser.email,
                username : curUser.displayName,
                photo : curUser.photoURL
            }).then(function() {
                onReady();
                document.location.href = "chat.html";
            });
            
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            onReady();
            alert(errorMessage);
          });
    });
    
    btnGithub.addEventListener('click', function() {
        var provider = new firebase.auth.GithubAuthProvider();
        document.getElementById('loading').style.display = 'block';
        firebase.auth().signInWithPopup(provider).then(function(result) {
            notifyMe();
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var curUser = firebase.auth().currentUser;
            var usersRef = firebase.database().ref('user_list/');
            usersRef.child(curUser.uid).set({
                email: curUser.email,
                username : curUser.displayName,
                photo : curUser.photoURL
            }).then(function() {
                onReady();
                document.location.href = "chat.html";
            });
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            onReady();
            alert(errorMessage);
        });
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



function notifyMe() {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification('Greetings', {
            icon: 'https://firebasestorage.googleapis.com/v0/b/haha-chatroom.appspot.com/o/firebase-logo.png?alt=media&token=865616df-47d5-403d-b89b-6811635a7398',
            body: 'Welcome to Haha Chatroom!',
        });
    }
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
    notifyMe();
};