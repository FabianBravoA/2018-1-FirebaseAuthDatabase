window.onload = ()=>{
    firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            //Si estamos logueados
            loggedOut.style.display = "none";
            loggedIn.style.display = "block";
            console.log("User > "+JSON.stringify(user));
        }else{
            //No estamos logueados
            loggedOut.style.display = "block";
            loggedIn.style.display = "none";
        }
    });

    firebase.database().ref('messages')
        .limitToLast(2) // Filtro para no obtener todos los mensajes
        .once('value')
        .then((messages)=>{
            console.log("Mensajes > "+JSON.stringify(messages));
        })
        .catch(()=>{

        });

    //Acá comenzamos a escuchar por nuevos mensajes usando el evento
    //on child_added
    firebase.database().ref('messages')
        .limitToLast(1)
        .on('child_added', (newMessage)=>{
            messageContainer.innerHTML += `
                <p>Nombre : ${newMessage.val().creatorName}</p>
                <p>${newMessage.val().text}</p>
            `;
        });
};

function register(){
    const emailValue = email.value;
    const passwordValue = password.value; 
    firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
        .then(()=>{
            console.log("Usuario registrado");
        })
        .catch((error)=>{
            console.log("Error de firebase > "+error.code);
            console.log("Error de firebase, mensaje > "+error.message);
        });
}

function login(){
    const emailValue = email.value;
    const passwordValue = password.value;
    firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
        .then(()=>{
            console.log("Usuario con login exitoso");
        })
        .catch((error)=>{
            console.log("Error de firebase > "+error.code);
            console.log("Error de firebase, mensaje > "+error.message);
        });
}

function logout(){
    firebase.auth().signOut()
        .then(()=>{
            console.log("Chao");
        })
        .catch();
}

function loginFacebook(){
    const provider = new firebase.auth.FacebookAuthProvider();
    //provider.addScope("user_birthday"); tienen que pedirle permiso a facebook
    provider.setCustomParameters({
        'display': 'popup'
    }); 
    firebase.auth().signInWithPopup(provider)
        .then(()=>{
            console.log("Login con facebook");
        })
        .catch((error)=>{
            console.log("Error de firebase > "+error.code);
            console.log("Error de firebase, mensaje > "+error.message);
        });
}

// Firebase Database

// Usaremos una colección para guardar los mensajes, llamada messages
function sendMessage(){
    const currentUser = firebase.auth().currentUser;
    const messageAreaText = messageArea.value;

    //Para tener una nueva llave en la colección messages
    const newMessageKey = firebase.database().ref().child('messages').push().key;

    firebase.database().ref(`messages/${newMessageKey}`).set({
        creator : currentUser.uid,
        creatorName : currentUser.displayName,
        text : messageAreaText
    });
}