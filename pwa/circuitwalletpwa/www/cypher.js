function encrypt(message, key){
    return CryptoJS.AES.encrypt(message, key).toString();
}

function decrypt(message, key){
    const decryptedBytes = CryptoJS.AES.decrypt(message, key);
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}

async function putValueToLocalStorage(key, value, password) {
    const encryptedValue = encrypt(value, password);
    localStorage.setItem(key, encryptedValue);
    // No need to await, localStorage is synchronous
}

async function getValueFromLocalStorage(key, password) {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null; // handle missing key
    return decrypt(encryptedValue, password);
}

async function savePassword(password){
    localStorage.setItem("userPassword", password);
}

async function getPassword(){
    return localStorage.getItem("userPassword");
}

async function checkForStoredData(){
    const passwordHash = localStorage.getItem("passwordHash");
    console.log(passwordHash);
    return passwordHash !== null;
}
