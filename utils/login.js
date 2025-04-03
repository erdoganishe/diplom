//------------------------------------------------------------
// Login

const input = document.getElementById("login-password-input");
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", async () => {
    const password = input.value;
    console.log(CryptoJS.SHA256(password).toString());
    await getValueFromLocalStorage("passwordHash", password).then((passwordHash) => {
        if (CryptoJS.SHA256(password).toString() == passwordHash){
            console.log("password pass!");
            try {
                savePassword(password);
                window.location.href = "home.html";
            } catch(e) {
                console.log("Some error: ", e);
            }
        } else {
            alert("Wrong Password!");
        }
    });
   
});

//------------------------------------------------------------
// Recover

const forgotPasswordButton = document.getElementById("forgot-password-button");
forgotPasswordButton.addEventListener("click", ()=>{
    window.location.href = "recover.html";
});