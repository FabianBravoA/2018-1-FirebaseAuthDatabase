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