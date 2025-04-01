const hashed = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"; // change from hardcode
const input = document.getElementById("login-password-input");
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", () => {
    const password = input.value;

    if (CryptoJS.SHA256(password).toString() == hashed){
        console.log(1);
        // redirect
    } else {
        alert("Wrong Password!");
    }
});