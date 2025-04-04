let localHistory = [];
// let privateKey = getValueFromLocalStorage("privateKey", password);
// let address = config.TEST_RANDOM_ADDRESS;
let mnemonic = "";
let privateKey = "";
let address = "";
let publicKey = "";
let INFURA_API_KEY = config.INFURA_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/" + INFURA_API_KEY
);
let signer;

document.addEventListener("DOMContentLoaded", async () => {
  await getPassword()
    .then(async (password) => {
      if (password == "") {
        window.location.href = "login.html";
      }
      await getValueFromLocalStorage("mnemonic", password).then(
        (result) => (mnemonic = result)
      );
      await getValueFromLocalStorage("privateKey", password).then(
        (result) => (privateKey = result)
      );
      await getValueFromLocalStorage("publicKey", password).then(
        (result) => (publicKey = result)
      );
      await getValueFromLocalStorage("address", password).then(
        (result) => (address = result)
      );

      savePassword("");
    })
    .then(() => {
      signer = new ethers.Wallet(privateKey, provider);

      //------------------------------------------------------------
      // Receive
      const qrCodeContainer = document.getElementById("qrCodeContainer");
      new QRCode(qrCodeContainer, {
        text: address,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    });
  let curBal = 0;

  await updateBalance();

  copyAddressButton.innerHTML = address.slice(0,6) + "..." + address.slice(-4);
});

//------------------------------------------------------------
// Balance and address

// TODO: remove alert and replace with notification popup!
const balanceLabel = document.getElementById("current-balance-label");
async function updateBalance() {
  await provider.getBlockNumber().then(async (currentBlock) => {
    await getBalanceAtBlock(address, currentBlock).then((currentBalance) => {
      balanceLabel.innerHTML =
        parseFloat(currentBalance).toFixed(4) + " SepoliaETH";
    });
  });
}

const copyAddressButton = document.getElementById("copy-address-button");
copyAddressButton.addEventListener("click", () => {
  navigator.clipboard
    .writeText(address)
    .then(() => {
      alert("Address copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});


//------------------------------------------------------------
// Header buttons

const sendPopupButton = document.getElementById("header-send-button");
const receivePopupButton = document.getElementById("header-receive-button");
const contractPopupButton = document.getElementById("header-contract-button");
const swapPopupButton = document.getElementById("header-swap-button");
const popupsContainers = document.getElementsByClassName("inner-popup");

sendPopupButton.addEventListener("click", () => {
  Array.from(popupsContainers).forEach((elem) => {
    elem.classList.add("hidden");
  });

  const sendPopup = document.getElementById("send-popup");
  sendPopup.classList.remove("hidden");
});

receivePopupButton.addEventListener("click", () => {
  Array.from(popupsContainers).forEach((elem) => {
    elem.classList.add("hidden");
  });

  const receivePopup = document.getElementById("receive-popup");
  receivePopup.classList.remove("hidden");
});

swapPopupButton.addEventListener("click", () => {
  Array.from(popupsContainers).forEach((elem) => {
    elem.classList.add("hidden");
  });

  const swapPopup = document.getElementById("swap-popup");
  swapPopup.classList.remove("hidden");
});

contractPopupButton.addEventListener("click", () => {
  Array.from(popupsContainers).forEach((elem) => {
    elem.classList.add("hidden");
  });

  const contractPopup = document.getElementById("contract-popup");
  contractPopup.classList.remove("hidden");
});

//------------------------------------------------------------
// Close popups

const sendClosePopupButton = document.getElementById("send-close-button");
const receiveClosePopupButton = document.getElementById("receive-close-button");
const contractClosePopupButton = document.getElementById(
  "contract-close-button"
);
const swapClosePopupButton = document.getElementById("swap-close-button");

sendClosePopupButton.addEventListener("click", () => {
  const sendPopup = document.getElementById("send-popup");
  sendPopup.classList.add("hidden");
});

receiveClosePopupButton.addEventListener("click", () => {
  const receivePopup = document.getElementById("receive-popup");
  receivePopup.classList.add("hidden");
});

contractClosePopupButton.addEventListener("click", () => {
  const contractPopup = document.getElementById("contract-popup");
  contractPopup.classList.add("hidden");
});

swapClosePopupButton.addEventListener("click", () => {
  const contractPopup = document.getElementById("swap-popup");
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
footerHomeButton.addEventListener("click", () => {
  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });

  //updateLocalHistory();

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
  });
  footerHomeButton.classList.add("active");
});

footerHistoryButton.addEventListener("click", () => {
  const historyContainer = document.getElementById("history-container");

  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });
  historyContainer.classList.remove("hidden");

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
  });
  footerHistoryButton.classList.add("active");
});

footerSettingsButton.addEventListener("click", () => {
  const settingsContainer = document.getElementById("settings-container");

  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });
  settingsContainer.classList.remove("hidden");

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
  });
  footerSettingsButton.classList.add("active");
});

//------------------------------------------------------------
// Send tx
const sendTxButton = document.getElementById("send-tx-button");
sendTxButton.addEventListener("click", async () => {
  sendTxButton.disabled = true;
  const sendAddressInput = document.getElementById("send-address-input");
  const sendAmountInput = document.getElementById("send-amount-input");
  // TODO: 
  // errors
  if (!sendAddressInput.value){
    alert("Put address!");
    sendTxButton.disabled = false;
    return;
  }
  if (!sendAmountInput.value){
    alert("Put value!");
    sendTxButton.disabled = false;
    return;
  }
  // TODO: add try except to not push errors to local history
  await sendTransaction(
    sendAddressInput.value,
    sendAmountInput.value.toString(),
    signer
  ).then(async (result) => {
    localHistory.push(result);
    if (footerHomeButton.classList.contains("active")) {
      //updateLocalHistory();
    }
    const sendPopup = document.getElementById("send-popup");
    sendPopup.classList.add("hidden");
    await updateBalance();
  });
  sendTxButton.disabled = false;

});

//------------------------------------------------------------
// Deploy contract
const abiInput = document.getElementById("contract-abi-input");
const bytecodeInput = document.getElementById("contract-bytecode-input");
const deployContractButton = document.getElementById("contract-delploy");
deployContractButton.addEventListener("click", async () => {
  deployContractButton.disabled = true;
  try {
    await deploySmartContract(
      bytecodeInput.value,
      JSON.parse(abiInput.value)
    ).then(async (result) => {
      console.log(result);
      localHistory.push(result);
      if (footerHomeButton.classList.contains("active")) {
        //updateLocalHistory();
      }
      const contractPopup = document.getElementById("contract-popup");
      contractPopup.classList.add("hidden");
      await updateBalance();
    });
  } catch {
    // TODO: remove alert
    alert("Something went wrong");
    deployContractButton.disabled = false;
  }
});
//------------------------------------------------------------
// Swap

const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
const UNISWAP_ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
];
const WETH_ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
const TOKEN_ADDRESS = "0x7169d38820dfd117c3fa1f22a697dba58d90ba06";

const swapButton = document.getElementById("swap-token-button");
const swapAmountInput = document.getElementById("swap-amount-input");
swapButton.addEventListener("click", async () => {
  swapButton.disabled = true;
  const amountInEth = swapAmountInput.value;
  await swapSepoliaEthForTokens(amountInEth).then(async (result) => {
    localHistory.push(result);
    if (footerHomeButton.classList.contains("active")) {
      //updateLocalHistory();
    }
    const contractPopup = document.getElementById("swap-popup");
    contractPopup.classList.add("hidden");
    await updateBalance();
    swapButton.disabled = false;
  });
});

//------------------------------------------------------------
// Local History

function updateLocalHistory() {
  const localHistoryContainer = document.getElementById(
    "local-history-container"
  );
  localHistoryContainer.classList.remove("hidden");
  localHistoryContainer.innerHTML = "";
  console.log(localHistory);
  localHistory.forEach((elem) => {
    const historyElem = document.createElement("div");
    // TODO: Add some more to div (class, children, etc)
    switch (elem.type) {
      case "swap": {
        historyElem.innerHTML = elem.txHash + " " + elem.amount + " ETH";
        break;
      }
      case "send": {
        historyElem.innerHTML =
          elem.txHash +
          " " +
          elem.value +
          " ETH " +
          elem.to +
          " " +
          elem.timestamp;
        break;
      }
      case "contract": {
        historyElem.innerHTML = elem.txHash + " " + elem.status;
        break;
      }
      default: {
        historyElem.innerHTML = "Unknown operation";
      }
    }

    localHistoryContainer.appendChild(historyElem);
  });
}

//------------------------------------------------------------
// History

// const graphContainer = document.getElementById("graph-container");
// TODO: change to actual graph
function buildGraph(data) {

  new Chart("graph-chart", {
    type: "line",
    data: {
      labels: data.map((el) => el.dateTime),
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(50,152,255,1.0)",
        borderColor: "rgba(50,152,255,1.0)",
        data: data.map((el) => el.balance)
      }]
    },
    options: {
      legend: { display: false },
    },
  });
}

const dayGraphButton = document.getElementById("graph-button1");
const weakGraphButton = document.getElementById("graph-button7");
const monthraphButton = document.getElementById("graph-button30");
const yearGraphButton = document.getElementById("graph-button365");

dayGraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  console.log("start");
  dayGraphButton.classList.add("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");

  await fetchRecentBalances(address, 12, 580).then((result) => {
    buildGraph(result);
  });
});

weakGraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.add("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");
  await fetchRecentBalances(address, 14, 3500).then((result) => {
    buildGraph(result);
  });
});

monthraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.add("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");
  await fetchRecentBalances(address, 15, 14000).then((result) => {
    buildGraph(result);
  });
});

yearGraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.add("active-graph-button");
  await fetchRecentBalances(address, 12, 210000).then((result) => {
    buildGraph(result);
  });
});

//------------------------------------------------------------
// Setting

const logOutButton = document.getElementById("logout-button");
logOutButton.addEventListener("click", async () => {
  await putValueToLocalStorage("passwordHash", "", "");
  await putValueToLocalStorage("mnemonic", "", "");
  await putValueToLocalStorage("privateKey", "", "");
  await putValueToLocalStorage("publicKey", "", "");
  await putValueToLocalStorage("address", "", "");

  window.location.href = "recover.html";
});

const copyPrivKeyButton = document.getElementById("copy-private-key");
copyPrivKeyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(privateKey);
  alert("Private key copied to clipboard!");
});

//------------------------------------------------------------
// Extension button
document.getElementById("openTabButton").addEventListener("click", async () => {
  const extensionURL = browser.runtime.getURL("utils/home.html"); 
  await browser.tabs.create({ url: extensionURL });
});
