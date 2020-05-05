var user_email = '';
var chat_key = '';
var sender_username;
var msgRef;
var temp_ref;
var flag = [];

function init() {
    firebase.auth().onAuthStateChanged(function(user) {
        var profile_name = document.getElementById('profile-name');
        
        if (user) {
            user_email = user.email;
            profile_name.innerHTML = user.displayName;
            if(user.displayName == null) {
                user.updateProfile({
                    photoURL: "https://www.meme-arsenal.com/memes/4b353ab564805a4c6a0a7cea9168e753.jpg"
                })
            }
            $('#profile_img').attr("src",user.photoURL);
            var logoutButt = document.getElementById('logout');
            logoutButt.innerHTML = "Logout";
            logoutButt.addEventListener('click', function() {
                firebase.auth().signOut().then(function() {
                    alert("Logout success!");
                    profile_name.innerHTML = "NULL";
                    logoutButt.innerHTML = "";
                    document.location.href = "index.html";
                  }).catch(function(error) {
                    alert("Error!");
                  });
            });

        } else {
            profile_name.innerHTML = "NULL";
            logoutButt.innerHTML = "";
        }
    });
    
    $('#create_chatroom').click(function() {
        var verification_flag = 0;
        var doubleadd_flag = 1;
        var txtList = $('#inputList').val();
        var postsRef = firebase.database().ref('user_chat');
        var userListRef = firebase.database().ref('user_list');
        postsRef.once('value').then(function(snapshot) {
            snapshot.forEach(function(data) {
                var childData = data.val();
                if(txtList != "") {
                    if((childData.email1 == user_email && childData.email2 == txtList) || (childData.email1 == txtList && childData.email2 == user_email)) {
                        alert("Added before");
                        doubleadd_flag = 0;
                    }
                }
            })
        })

        userListRef.once('value').then(function(snapshot) {
            snapshot.forEach(function(data) {
                var childData = data.val();
                if(txtList != "") {
                    if(childData.email == txtList) {
                        alert("Added successfully!");
                        verification_flag = 1;
                    }
                }
            })
        }).then(function() {
            if(txtList != "" && doubleadd_flag == 1 && verification_flag == 1) {
                var database = firebase.database().ref('user_chat/');
                database.push({
                    email1: user_email,
                    email2: txtList
                });
            } else if(verification_flag == 0) {
                alert("Email doesn't exist");
            }
        })

        
        
    });

    var str_before_username = "<label class='btn btn-primary'><img src = '";
    var str_after_username = "'></img><input type='radio' name='options'";
    var str_after_content = "</label>";

    var postsRef = firebase.database().ref('user_chat');

    postsRef.once('value')
        .then(function(snapshot) {
            /*snapshot.forEach(function(data){
                if(data.val().email1 == user_email) {
                    $('.contact-list').append(str_before_username + "onclick = 'openchatRoom(\"" + data.key + "\")'> <p>" + data.val().email2 + str_after_content);
                } else if(data.val().email2 == user_email) {
                    $('.contact-list').append(str_before_username + "onclick = 'openchatRoom(\"" + data.key + "\")'> <p>" + data.val().email1 + str_after_content);
                }
            });*/

            postsRef.on('child_added', function(data) {
                /*if(data.val().email1 == user_email) {
                    $('.btn-group-vertical').append(str_before_username + "onclick = 'get_sender_name(\"" + data.val().email2 + "\"); openchatRoom(\"" + data.key + "\")'> <p>" + data.val().email2 + str_after_content);
                } else if(data.val().email2 == user_email) {
                    $('.btn-group-vertical').append(str_before_username + "onclick = 'get_sender_name(\"" + data.val().email1 + "\"); openchatRoom(\"" + data.key + "\")'> <p>" + data.val().email1 + str_after_content);
                }*/
                if(data.val().email1 == user_email) {
                    var temp_ref = firebase.database().ref('user_list');
                    var photo_url;
                    temp_ref.once('value').then(function(snapshot) {
                        snapshot.forEach(function(element) {
                            var elementVal = element.val();
                            if(elementVal.email == data.val().email2) {
                                photo_url = elementVal.photo;
                            }
                        });
                    }).then(function() {
                        $('.btn-group-vertical').append(str_before_username + photo_url + str_after_username + "onclick = 'openchatRoom(\"" + data.key + " " + data.val().email2 + "\")'> <p>" + data.val().email2 + str_after_content);
                    })
                } else if(data.val().email2 == user_email) {
                    var temp_ref = firebase.database().ref('user_list');
                    var photo_url;
                    temp_ref.once('value').then(function(snapshot) {
                        snapshot.forEach(function(element) {
                            var elementVal = element.val();
                            if(elementVal.email == data.val().email1) {
                                photo_url = elementVal.photo;
                            }
                        });
                    }).then(function() {
                        $('.btn-group-vertical').append(str_before_username + photo_url + str_after_username + "onclick = 'openchatRoom(\"" + data.key + " " + data.val().email1 + "\")'> <p>" + data.val().email1 + str_after_content);
                    })
                }
            }) 


        })
        .catch(e => console.log(e.message));
}
var strt = 0;
function openchatRoom(room) {
    var array = room.split(" ");
    room = array[0];
    if(flag.includes(room) || strt == 1) {
        strt = 0;
        msgRef.off();
        //msgRef = firebase.database().ref('user_chat/' + room + '/messages');
    }
    flag.push(room);
    chat_key = room;
    document.getElementById('msgpage').innerHTML = "";
    strt = 1;
    
    var Ref = firebase.database().ref('user_list');
    Ref.on('child_added', function(data) {
        if(data.val().email == array[1]) {
            document.getElementById('received-name').innerHTML = data.val().username;
            $('.sender_photo').attr("src", data.val().photo);
            $('#msg_header_img').attr("src", data.val().photo);
        }
    })


    var sent_one = '<li class = "sent">';
    var sent_two = '</p></li>';


    var reply_one = '<li class = "reply"><p>';
    var reply_two = '</p></li>'
    msgRef = firebase.database().ref('user_chat/' + room + '/messages');
    temp_ref = firebase.database().ref('user_list');
    var photo_url;
    temp_ref.once('value').then(function(snapshot) {
        snapshot.forEach(function(element) {
            var elementVal = element.val();
            if(elementVal.email == array[1]) {
                photo_url = elementVal.photo;
            }
        });
    }).then(function() {
        msgRef.on('child_added', function(data) {
            if(data.val().email != user_email) {
                $('#msgpage').append(sent_one + "<img src =" + photo_url + "><p>" + data.val().message + sent_two);
            } else {
                $('#msgpage').append(reply_one + data.val().message + reply_two);
            }
        }).then(function() {
            alert("now removing postsref");
        })
    }).then(function() {
        alert("now removing temp_ref");
    })
    return 0;
}

$('#textbox').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13' && $('#textbox').val() != '' && $('#msg_header_img').attr("src") != undefined){
        var postsRef = firebase.database().ref('user_chat/' + chat_key + '/messages');
        var msg = $('#textbox').val().replace(/[&]/g, "&amp");
        msg = msg.replace(/[<]/g, "&lt").replace(/[>]/g, "&gt");
        postsRef.push({
            email: user_email,
            message: msg
        });
        $('#textbox').val("");
        return false;
    } else if(keycode == '13' && $('#textbox').val() == '') {
        return false;
    }
});

window.onload = function() {
    init();
};