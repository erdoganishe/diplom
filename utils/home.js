let INFURA_API_KEY = config.INFURA_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(
    'https://sepolia.infura.io/v3/' + INFURA_API_KEY
);
const privateKey = config.TEST_PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);
const localHistory = []
// TODO: Fetch from local storage
const address = config.TEST_RANDOM_ADDRESS;


//------------------------------------------------------------
// Balance and address

// TODO: remove alert and replace with notification popup!
const balanceLabel = document.getElementById("current-balance-label");
const copyAddressButton = document.getElementById("copy-address-button");
copyAddressButton.addEventListener("click", ()=>{
    navigator.clipboard.writeText(address)
    .then(() => {
      alert('Address copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
});

//------------------------------------------------------------
// Header buttons

const sendPopupButton = document.getElementById("header-send-button");
const receivePopupButton = document.getElementById("header-receive-button");
const contractPopupButton = document.getElementById("header-contract-button");
const swapPopupButton = document.getElementById("header-swap-button");

sendPopupButton.addEventListener("click", () => {
    const sendPopup = document.getElementById("send-popup");
    sendPopup.classList.remove("hidden");

    const receivePopup = document.getElementById("receive-popup");
    receivePopup.classList.add("hidden");
    const contractPopup = document.getElementById("receive-popup");
    contractPopup.classList.add("hidden");
});

receivePopupButton.addEventListener("click", () => {
    const receivePopup = document.getElementById("receive-popup");
    receivePopup.classList.remove("hidden");

    const sendPopup = document.getElementById("send-popup");
    sendPopup.classList.add("hidden");
    const contractPopup = document.getElementById("contract-popup");
    contractPopup.classList.add("hidden");


});

contractPopupButton.addEventListener("click", () => {
    const contractPopup = document.getElementById("contract-popup");
    contractPopup.classList.remove("hidden");

    const sendPopup = document.getElementById("send-popup");
    sendPopup.classList.add("hidden");
    const receivePopup = document.getElementById("receive-popup");
    receivePopup.classList.add("hidden");
});

//------------------------------------------------------------
// Close popups

const sendClosePopupButton = document.getElementById("send-close-button");
const receiveClosePopupButton = document.getElementById("receive-close-button");
const contractClosePopupButton = document.getElementById("contract-close-button");

sendClosePopupButton.addEventListener("click", ()=>{
    const sendPopup = document.getElementById("send-popup");
    sendPopup.classList.add("hidden");
});

receiveClosePopupButton.addEventListener("click", ()=>{
    const receivePopup = document.getElementById("receive-popup");
    receivePopup.classList.add("hidden");
});

contractClosePopupButton.addEventListener("click", ()=>{
    const contractPopup = document.getElementById("contract-popup");
    contractPopup.classList.add("hidden");
});

//------------------------------------------------------------
// Footer buttons setup
const footerHomeButton = document.getElementById("footer-home-button");
const footerHistoryButton = document.getElementById("footer-history-button");
const footerVotingButton = document.getElementById("footer-voting-button");
const footerSettingsButton = document.getElementById("footer-settings-button");
const footerButtons = document.getElementsByClassName("footer-button");
const mainContentDivs = document.getElementsByClassName("main-content-div");
// TODO: add active ...
footerHomeButton.addEventListener("click", ()=>{
    Array.from(mainContentDivs).forEach((elem)=>{
        elem.classList.add("hidden");
    });
    updateLocalHistory();
    Array.from(footerButtons).forEach((elem)=>{
        elem.classList.remove("active");
    });
    footerHomeButton.classList.add("active");

});

footerHistoryButton.addEventListener("click", ()=>{

    const historyContainer = document.getElementById("history-container");

    Array.from(mainContentDivs).forEach((elem)=>{
        elem.classList.add("hidden");
    });
    historyContainer.classList.remove("hidden");


    Array.from(footerButtons).forEach((elem)=>{
        elem.classList.remove("active");
    });
    footerHistoryButton.classList.add("active");

});

//------------------------------------------------------------
// Send tx 
// TODO: block button when processing
const sendTxButton = document.getElementById("send-tx-button");
sendTxButton.addEventListener('click', async () => {
    const sendAddressInput = document.getElementById("send-address-input");
    const sendAmountInput = document.getElementById("send-amount-input");
    // Add validation checks later
    // TODO: add try except to not push errors to local history
    await sendTransaction(sendAddressInput.value, sendAmountInput.value.toString())
        .then((result) => {
            console.log(result); 
            localHistory.push(result);
            if (footerHomeButton.classList.contains("active")){
                updateLocalHistory();
            }
            const sendPopup = document.getElementById("send-popup");
            sendPopup.classList.add("hidden");
        });
});

//------------------------------------------------------------
// Receive 
const qrCodeContainer = document.getElementById("qrCodeContainer");
new QRCode(qrCodeContainer, {
    text: address,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

//------------------------------------------------------------
// Deploy contract
// TODO: block button when processing
const abiInput = document.getElementById("contract-abi-input");
const bytecodeInput = document.getElementById("contract-bytecode-input");
const deployContractButton = document.getElementById("contract-delploy");
deployContractButton.addEventListener("click", async () => {
    await deploySmartContract(bytecodeInput.value, JSON.parse(abiInput.value))
        .then((result) => {
            console.log(result);
            localHistory.push(result);
            if (footerHomeButton.classList.contains("active")){
                updateLocalHistory();
            }
            const contractPopup = document.getElementById("contract-popup");
            contractPopup.classList.add("hidden");
        });
});


//------------------------------------------------------------
// Local History

function updateLocalHistory(){

    const localHistoryContainer = document.getElementById("local-history-container");
    localHistoryContainer.classList.remove("hidden");
    localHistoryContainer.innerHTML = "";
    localHistory.forEach((elem) => {
        const historyElem = document.createElement("div");
        // TODO: Add some more to div (class, children, etc)
        // TODO: Add swap case
        if (elem.to){
            // Tx
            historyElem.innerHTML = elem.txHash + " " + elem.value + " ETH " + elem.to + " " + elem.timestamp;
        } else {
            // Deploying
            historyElem.innerHTML = elem.txHash + " " + elem.status;
        }
        localHistoryContainer.appendChild(historyElem);
    });
}

//------------------------------------------------------------
// History

const graphContainer = document.getElementById("graph-container");
// TODO: change to actual graph
function buildGraph(data){
    graphContainer.innerHTML = data;
}

const dayGraphButton = document.getElementById("graph-button1");
const weakGraphButton = document.getElementById("graph-button7");
const monthraphButton = document.getElementById("graph-button30");
const yearGraphButton = document.getElementById("graph-button365");

dayGraphButton.addEventListener("click", async ()=>{
    graphContainer.innerHTML = "";
    console.log("start");
    dayGraphButton.classList.add("active-graph-button");
    weakGraphButton.classList.remove("active-graph-button");
    monthraphButton.classList.remove("active-graph-button");
    yearGraphButton.classList.remove("active-graph-button");

    await fetchRecentBalances(address, 12, 580)
        .then((result) => {
            buildGraph(result);
        });
});

weakGraphButton.addEventListener("click", async ()=>{
    graphContainer.innerHTML = "";
    dayGraphButton.classList.remove("active-graph-button");
    weakGraphButton.classList.add("active-graph-button");
    monthraphButton.classList.remove("active-graph-button");
    yearGraphButton.classList.remove("active-graph-button");
    await fetchRecentBalances(address, 14, 3500)
        .then((result) => {
            buildGraph(result);
        });
});

monthraphButton.addEventListener("click", async ()=>{
    graphContainer.innerHTML = "";
    dayGraphButton.classList.remove("active-graph-button");
    weakGraphButton.classList.remove("active-graph-button");
    monthraphButton.classList.add("active-graph-button");
    yearGraphButton.classList.remove("active-graph-button");
    await fetchRecentBalances(address, 15, 14000)
        .then((result) => {
            buildGraph(result);
        });
});

yearGraphButton.addEventListener("click", async ()=>{
    graphContainer.innerHTML = "";
    dayGraphButton.classList.remove("active-graph-button");
    weakGraphButton.classList.remove("active-graph-button");
    monthraphButton.classList.remove("active-graph-button");
    yearGraphButton.classList.add("active-graph-button");
    await fetchRecentBalances(address, 12, 210000)
        .then((result) => {
            buildGraph(result);
        });
});