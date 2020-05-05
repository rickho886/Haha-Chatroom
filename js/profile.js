function initApp() {
    // Login with Email/Password
    var txtUsername = document.getElementById('UsernameArea');
    var txtPassword = document.getElementById('PasswordArea');
    var txtrepeatPassword = document.getElementById('repeatPasswordArea');
    var btnSubmit = document.getElementById('submitButton');
    var selectedFile;
    var storageRef;
    var getfile = document.getElementById('myfile');
    getfile.addEventListener('change', function() {
        selectedFile = getfile.files[0];
    });

    
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            txtUsername.value = user.displayName;
        }
    });

    btnSubmit.addEventListener('click', function() {
        document.getElementById('loading').style.display = 'block';
        if(txtPassword.value == txtrepeatPassword.value && txtPassword.value == "") {
            var user = firebase.auth().currentUser;
            var usersRef = firebase.database().ref('user_list/');
            var photo_url;
            if(selectedFile != undefined) {
                var storageRef = firebase.storage().ref(user.uid); 
                var uploadTask = storageRef.put(selectedFile); 
                uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
                    user.updateProfile({
                        photoURL: url
                    })
                    usersRef.child(user.uid + '/photo').set(url);
                })
            }
            usersRef.child(user.uid + '/username').set(txtUsername.value);
            user.updateProfile({
                displayName: txtUsername.value
            }).then(function() {
                alert("Success");
                onReady();
                txtPassword.value = "";
                txtrepeatPassword.value = "";
                document.location.href = "chat.html";
            }).catch(function(error) {
                var errorMessage = error.message;
                alert(errorMessage);
                onReady();
                txtPassword.value = "";
                txtrepeatPassword.value = "";
            });
        } else if(txtPassword.value == txtrepeatPassword.value ) {
            var user = firebase.auth().currentUser;
            if(selectedFile != undefined) {
                var storageRef = firebase.storage().ref(user.uid); 
                var uploadTask = storageRef.put(selectedFile); 
                uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
                    user.updateProfile({
                        photoURL: url
                    })
                })
            }
            var usersRef = firebase.database().ref('user_list/');
            usersRef.child(user.uid + '/username').set(txtUsername.value);
            user.updateProfile({
                displayName: txtUsername.value,
            }).then(function() {
                user.updatePassword(txtPassword.value).then(function() {
                    alert("Success");
                    txtPassword.value = "";
                    txtrepeatPassword.value = "";
                }).then(function() {
                    document.location.href = "chat.html";
                })
                onReady();
                
            }).catch(function(error) {
                var errorMessage = error.message;
                alert(errorMessage);
                onReady();
                txtPassword.value = "";
                txtrepeatPassword.value = "";
            });
        } else {
            alert('Password not match');
            onReady();
            txtPassword.value = "";
            txtrepeatPassword.value = "";
        }

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