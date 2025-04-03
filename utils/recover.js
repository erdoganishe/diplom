const toLoginButton = document.getElementById("to-login-button");
const toRegisterButton = document.getElementById("to-login-button");
const conformNewPasswordButton = document.getElementById("confirm-new-password-button");

const mnemonicInputs = document.getElementsByClassName("phrase-container");
const passwordInputs = document.getElementsByClassName("password-input");

Array.from(mnemonicInputs).forEach((elem)=>{
    elem.addEventListener("change", () => {
        const words = elem.value.split(" ");
        console.log(words);
        if (words.length == 12){
            for (var i = 0; i < 12; i++){
                Array.from(mnemonicInputs)[i].value = words[i];
            }
        }
    });
});

conformNewPasswordButton.addEventListener("click", async ()=>{
    mnemonic = "";
    Array.from(mnemonicInputs).forEach((elem) => {
        mnemonic += elem.value + " ";
    });
    mnemonic = mnemonic.slice(0, -1);
    console.log(mnemonic);
    let password = "";
    if (passwordInputs[0].value && passwordInputs[1].value && passwordInputs[0].value == passwordInputs[1].value){
        password = passwordInputs[0].value;
        try {
            let params = generateAllfromMnemonic(mnemonic);
            const passwordHash = CryptoJS.SHA256(password).toString();

            await putValueToLocalStorage("passwordHash", passwordHash, password);
            await putValueToLocalStorage("mnemonic", params.mnemonic, password);
            await putValueToLocalStorage("privateKey", params.privateKey, password);
            await putValueToLocalStorage("publicKey", params.publicKey, password);
            await putValueToLocalStorage("address", params.address, password);
            await savePassword(password);

            window.location.href = "home.html";
            
        } catch (e) {
            console.error(e);
            alert("Invalid mnemonic");
        }
    } else {
        if (!passwordInputs[0].value){
            alert("Provide password!");
            return;
        }
        if (!passwordInputs[1].value){
            alert("Provide password confirmation!");
            return;
        }
        if (passwordInputs[0].value != passwordInputs[1].value){
            alert("Passwords don`t match!");
            return;
        }
    }

});

toLoginButton.addEventListener("click", ()=>{
    window.location.href = "login.html";
});

toRegisterButton.addEventListener("click", ()=>{
    window.location.href = "register.html";
});
