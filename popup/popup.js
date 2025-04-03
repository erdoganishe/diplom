// const button = document.querySelector("#popup-content > button");
// console.log(button);
// button.addEventListener('click', () => {console.log(1)})

// browser.tabs
//   .executeScript({ file: "/content_scripts/wallet.js" })
//   .then(listenForClicks)
//   .catch(reportExecuteScriptError);


document.getElementById("hui").addEventListener("click", () => {

  console.log(browser);
  window.location.href='../utils/register.html';
});