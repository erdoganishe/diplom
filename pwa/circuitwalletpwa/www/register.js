let password = "";
let params = {};
let isFirst = true;
let indexes = [];

// const passwordInputs = document.getElementsByClassName("password-input");
const phraseInputs = document.getElementsByClassName("phrase-container");
console.log(phraseInputs.length);
const firstButtonNext = document.getElementById("nav-button-next1");
firstButtonNext.addEventListener("click", async () => {
  {
    document.getElementById("app-password").classList.add("hidden");
    document.getElementById("app-phrase").classList.remove("hidden");

    processKeys(isFirst);
  }
});

const revealButton = document.getElementById("reveal-button");
revealButton.addEventListener("click", () => {
  for (var i = 0; i < 12; i++) {
    phraseInputs[i].type = "text";
  }
});

const secondNextButton = document.getElementById("nav-button-next2");
secondNextButton.addEventListener("click", () => {
  document.getElementById("app-phrase").classList.add("hidden");
  document.getElementById("app-confirm-phrase").classList.remove("hidden");
  const phrase_arr = params.mnemonic.split(" ");

  for (var i = 0; i < 12; i++) {
    if (Array.from(indexes).includes(i)) {
      phraseInputs[i + 12].value = "";
      phraseInputs[i + 12].removeAttribute("readonly");
    } else {
      phraseInputs[i + 12].value = phrase_arr[i];
      phraseInputs[i + 12].setAttribute("readonly", "readonly");
    }
  }
});

const secondPrevButton = document.getElementById("nav-button-previous2");
secondPrevButton.addEventListener("click", () => {
  document.getElementById("app-password").classList.remove("hidden");
  document.getElementById("app-phrase").classList.add("hidden");
});

const thirdPrevButton = document.getElementById("nav-button-previous3");
thirdPrevButton.addEventListener("click", () => {
  document.getElementById("app-confirm-phrase").classList.add("hidden");
  document.getElementById("app-phrase").classList.remove("hidden");
});

const confirmButton = document.getElementById("confirm-button");
confirmButton.addEventListener("click", async () => {
  const userPhrase = [];
  for (var i = 12; i < 24; i++) {
    userPhrase.push(phraseInputs[i].value);
  }
  if (userPhrase.join(" ") == params.mnemonic) {
    const passwordHash = CryptoJS.SHA256(password);

    // await putValueToLocalStorage("passwordHash", passwordHash, password);
    // await putValueToLocalStorage("mnemonic", params.mnemonic, password);
    // await putValueToLocalStorage("privateKey", params.privateKey, password);
    // await putValueToLocalStorage("publicKey", params.publicKey, password);
    // await putValueToLocalStorage("address", params.address, password);
    // await savePassword(password);

    window.location.href = "home.html";
    showError("success");
  } else {
    showError("Wrong phrase!");
  }
});

const phraseCopyButton = document.getElementById("phrase-copy-button");
phraseCopyButton.addEventListener("click", () => {
  navigator.clipboard
    .writeText(params.mnemonic)
    .then(() => {
      console.log("Text copied to clipboard");
      showError("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});

function processKeys(first) {
  isFirst = false;
  if (first) {
    params = generateAll();
    indexes = getCheckPhrase(4, 11, params.mnemonic.split(" ")).indexes;
  }
  const phrase_arr = params.mnemonic.split(" ");
  for (var i = 0; i < 12; i++) {
    phraseInputs[i].value = phrase_arr[i];
    phraseInputs[i].type = "password";
  }
}

const toRecoverButton = document.getElementById("to-recover-button");

toRecoverButton.addEventListener("click", () => {
  window.location.href = "recover.html";
});

// //------------------------------------------------------------
// // Extension button
// document.getElementById("openTabButton").addEventListener("click", async () => {
//   const extensionURL = browser.runtime.getURL("utils/register.html");
//   await browser.tabs.create({ url: extensionURL });
// });
