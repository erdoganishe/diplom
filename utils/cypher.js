const browser = window.browser || chrome;

function encrypt(message, key){
    return CryptoJS.AES.encrypt(message, key).toString();
}

function decrypt(message, key){
    const decryptedBytes = CryptoJS.AES.decrypt(message, key);
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}

async function putValueToLocalStorage(key, value, password) {
    const encryptedPassword = encrypt(value, password);
    await browser.storage.local.set({ [key]: encryptedPassword });
}

async function getValueFromLocalStorage(key, password) {
    const result = await browser.storage.local.get(key);

    return decrypt(result[key], password);

}


async function savePassword(password){
    await browser.storage.local.set({ userPassword: password });
}

async function getPassword(){
    const result = await browser.storage.local.get("userPassword");

    return result.userPassword;
}

async function checkForStoredData(){
    const result = await browser.storage.local.get("passwordHash");
    console.log(result);
    if (result.passwordHash){
        return true;
    }
    return false;
}