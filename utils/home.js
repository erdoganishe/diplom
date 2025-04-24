let localHistory = [];
let mnemonic = "";
let privateKey = "";
let address = "";
let publicKey = "";
let cypherKey = "";
let INFURA_API_KEY = config.INFURA_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/" + INFURA_API_KEY
);
let signer;

document.addEventListener("DOMContentLoaded", async () => {
  // await browser.storage.local.set({localHistory: ""});

  await getPassword()
    .then(async (password) => {
      if (password == "") {
        window.location.href = "login.html";
      }
      cypherKey = password;
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
      try {
        await getValueFromLocalStorage("localHistory", password).then(
          (result) => {
            localHistory = JSON.parse(result);
          }
        );
      } catch (error) {
        console.log("error while reading history!");
        console.log(error);
      }

      console.log(mnemonic);
      console.log(privateKey);
      console.log(address);
      console.log(publicKey);

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
  copyAddressButton.innerHTML = address.slice(0, 6) + "..." + address.slice(-4);

  // TODO: fix local history
  // TODO: add edge case for clear history
  await updateLocalHistory();
  await fetchRecentBalances(address, 6, 1160).then((result) => {
    buildGraph(result);
  });
});

//------------------------------------------------------------
// Balance and address

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
      showError("Address copied to clipboard!");
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

footerHomeButton.addEventListener("click", async () => {
  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });

  await updateLocalHistory();

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
    elem.children[0].src = elem.children[0].src
      .toString()
      .replaceAll("_active", "");
  });
  footerHomeButton.classList.add("active");
  footerHomeButton.children[0].src =
    footerHomeButton.children[0].src.toString().slice(0, -4) + "_active.png";
});

footerHistoryButton.addEventListener("click", () => {
  const historyContainer = document.getElementById("history-container");

  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
    console.log(elem.classList);
  });
  historyContainer.classList.remove("hidden");

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
    elem.children[0].src = elem.children[0].src
      .toString()
      .replaceAll("_active", "");
  });
  footerHistoryButton.classList.add("active");
  footerHistoryButton.children[0].src =
    footerHistoryButton.children[0].src.toString().slice(0, -4) + "_active.png";
});

footerVotingButton.addEventListener("click", () => {
  const proofContainer = document.getElementById("proof-container");

  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });
  proofContainer.classList.remove("hidden");

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
    elem.children[0].src = elem.children[0].src
      .toString()
      .replaceAll("_active", "");
  });
  footerVotingButton.classList.add("active");
  footerVotingButton.children[0].src =
    footerVotingButton.children[0].src.toString().slice(0, -4) + "_active.png";
});

footerSettingsButton.addEventListener("click", () => {
  const settingsContainer = document.getElementById("settings-container");

  Array.from(mainContentDivs).forEach((elem) => {
    elem.classList.add("hidden");
  });
  settingsContainer.classList.remove("hidden");

  Array.from(footerButtons).forEach((elem) => {
    elem.classList.remove("active");
    elem.children[0].src = elem.children[0].src
      .toString()
      .replaceAll("_active", "");
  });
  footerSettingsButton.classList.add("active");
  footerSettingsButton.children[0].src =
    footerSettingsButton.children[0].src.toString().slice(0, -4) +
    "_active.png";
});

//------------------------------------------------------------
// Send tx
const sendTxButton = document.getElementById("send-tx-button");
sendTxButton.addEventListener("click", async () => {
  sendTxButton.disabled = true;
  const sendAddressInput = document.getElementById("send-address-input");
  const sendAmountInput = document.getElementById("send-amount-input");

  if (!sendAddressInput.value) {
    showError("Put address!");
    sendTxButton.disabled = false;
    return;
  }
  if (!sendAmountInput.value) {
    showError("Put value!");
    sendTxButton.disabled = false;
    return;
  }

  await sendTransaction(
    await sendTransaction(
      sendAddressInput.value,
      sendAmountInput.value.toString(),
      signer
    )
      .then(async (result) => {
        localHistory.push(result);
        if (footerHomeButton.classList.contains("active")) {
          await updateLocalHistory();
        }
        document.getElementById("send-popup").classList.add("hidden");
        await updateBalance();
      })
      .catch((error) => {
        console.error("Transaction failed:", error);
        showError("An error occurred while sending the transaction.");
      })
      .finally(() => {
        sendTxButton.disabled = false;
      })
  );
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
      localHistory.push(result);
      if (footerHomeButton.classList.contains("active")) {
        await updateLocalHistory();
      }
      const contractPopup = document.getElementById("contract-popup");
      contractPopup.classList.add("hidden");
      await updateBalance();
    });
  } catch {
    showError("Something went wrong");
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
      await updateLocalHistory();
    }
    const contractPopup = document.getElementById("swap-popup");
    contractPopup.classList.add("hidden");
    await updateBalance();
    swapButton.disabled = false;
  });
});

//------------------------------------------------------------
// Local History

async function updateLocalHistory() {
  const localHistoryContainer = document.getElementById(
    "local-history-container"
  );
  localHistoryContainer.classList.remove("hidden");
  localHistoryContainer.innerHTML = "";

  console.log(localHistory.length);

  if (localHistory.length == 0) {
    console.log(1);
    localHistoryContainer.innerHTML = "No operation yet!";
  }

  console.log(localHistory);
  localHistory.forEach((elem) => {
    const historyElem = document.createElement("div");
    // TODO: Add some more to div (class, children, etc)
    switch (elem.type) {
      case "swap": {
        historyElem.classList.add("local-history-elem-swap");

        const img = document.createElement("img");
        img.src = "../assets/swap.png";

        const paramsDiv = document.createElement("div");
        paramsDiv.classList.add("to-center-div", "fixed-width");

        const recepientDiv = document.createElement("div");
        recepientDiv.classList.add("local-history-elem-tx-hash");
        recepientDiv.innerHTML =
          elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
        recepientDiv.addEventListener("click", () => {
          navigator.clipboard.writeText(elem.txHash);
        });

        paramsDiv.appendChild(recepientDiv);

        const amountDiv = document.createElement("div");
        amountDiv.classList.add("fixed-width", "div-to-right");

        historyElem.appendChild(img);
        historyElem.appendChild(paramsDiv);
        historyElem.appendChild(amountDiv);

        break;
        // historyElem.innerHTML = elem.txHash + " " + elem.amount + " ETH";
        // break;
      }
      case "send": {
        historyElem.classList.add("local-history-elem-tx");

        const img = document.createElement("img");
        img.src = "../assets/send.png";

        const paramsDiv = document.createElement("div");
        paramsDiv.classList.add("to-center-div", "fixed-width");

        const recepientDiv = document.createElement("div");
        recepientDiv.classList.add("local-history-elem-tx-recepint");
        recepientDiv.innerHTML =
          elem.to.slice(0, 6) + "..." + elem.to.slice(-4);
        recepientDiv.addEventListener("click", () => {
          navigator.clipboard.writeText(elem.to);
        });
        const txHashDiv = document.createElement("div");
        txHashDiv.classList.add("local-history-elem-tx-hash");
        txHashDiv.innerHTML =
          elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
        txHashDiv.addEventListener("click", () => {
          navigator.clipboard.writeText(elem.txHash);
        });
        paramsDiv.appendChild(recepientDiv);
        paramsDiv.appendChild(txHashDiv);

        const amountDiv = document.createElement("div");
        amountDiv.classList.add(
          "local-history-elem-tx-amount",
          "fixed-width",
          "div-to-right"
        );
        amountDiv.innerHTML =
          parseFloat(elem.value).toFixed(4).toString() + " SepoliaETH";

        historyElem.appendChild(img);
        historyElem.appendChild(paramsDiv);
        historyElem.appendChild(amountDiv);

        break;
      }
      case "contract": {
        historyElem.classList.add("local-history-elem-contract");

        const img = document.createElement("img");
        img.src = "../assets/smart.png";

        const paramsDiv = document.createElement("div");
        paramsDiv.classList.add("to-center-div", "fixed-width");

        const recepientDiv = document.createElement("div");
        recepientDiv.classList.add("local-history-elem-tx-recepint");
        recepientDiv.innerHTML =
          "Status: " + elem.status ? "Success!" : "Revert!";
        const txHashDiv = document.createElement("div");
        txHashDiv.classList.add("local-history-elem-tx-hash");
        txHashDiv.innerHTML =
          elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
        txHashDiv.addEventListener("click", () => {
          navigator.clipboard.writeText(elem.txHash);
        });
        paramsDiv.appendChild(recepientDiv);
        paramsDiv.appendChild(txHashDiv);

        const amountDiv = document.createElement("div");
        amountDiv.classList.add("fixed-width", "div-to-right");

        historyElem.appendChild(img);
        historyElem.appendChild(paramsDiv);
        historyElem.appendChild(amountDiv);

        break;
        // historyElem.innerHTML = elem.txHash + " " + elem.status;
        // break;
      }
      default: {
        break;
      }
    }

    localHistoryContainer.appendChild(historyElem);
  });

  await putValueToLocalStorage(
    "localHistory",
    JSON.stringify(localHistory),
    cypherKey
  );
}

//------------------------------------------------------------
// History

function buildGraph(data) {
  new Chart("graph-chart", {
    type: "line",
    data: {
      labels: data.map((el) => el.dateTime),
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(50,152,255,1.0)",
          borderColor: "rgba(50,152,255,1.0)",
          data: data.map((el) => el.balance),
        },
      ],
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
  dayGraphButton.classList.add("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");

  buildGraph([
    {
      dateTime: 0,
      balance: 0,
    },
  ]);
  await fetchRecentBalances(address, 6, 2 * 580).then((result) => {
    buildGraph(result);
  });
});

weakGraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.add("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");
  buildGraph([
    {
      dateTime: 0,
      balance: 0,
    },
  ]);

  await fetchRecentBalances(address, 7, 7000).then((result) => {
    buildGraph(result);
  });
});

monthraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.add("active-graph-button");
  yearGraphButton.classList.remove("active-graph-button");
  buildGraph([
    {
      dateTime: 0,
      balance: 0,
    },
  ]);

  await fetchRecentBalances(address, 7, 28000).then((result) => {
    buildGraph(result);
  });
});

yearGraphButton.addEventListener("click", async () => {
  // graphContainer.innerHTML = "";
  dayGraphButton.classList.remove("active-graph-button");
  weakGraphButton.classList.remove("active-graph-button");
  monthraphButton.classList.remove("active-graph-button");
  yearGraphButton.classList.add("active-graph-button");
  buildGraph([
    {
      dateTime: 0,
      balance: 0,
    },
  ]);
  await fetchRecentBalances(address, 6, 420000).then((result) => {
    buildGraph(result);
  });
});

//------------------------------------------------------------
// Proof generation
const generateProofButton = document.getElementById("generate-proof-button");
const callContractButton = document.getElementById("call-contract-button");
generateProofButton.addEventListener("click", async () => {
  generateProofButton.disabled = true;
  function getRandom254BitHex() {
    const byteLength = Math.ceil(254 / 8); // 32 bytes
    const array = new Uint8Array(byteLength);
    window.crypto.getRandomValues(array);
    // Set the top two bits of the first byte to 0 to ensure 254 bits
    array[0] = array[0] & 0x3f;
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  function downloadJSON(obj, filename = "calldata.json") {
    const jsonString = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  //--------------------------------------
  // Fund contact to get it back later
  const calldata = '["0x226952847ae340d55fd5c10dd4a4dd15245e14a9c13f1cec41f3d33d680d1f13", "0x1f408457d1782e69cddf684ea5804de2e4650cd8adb12a5f21672c391c7e7765"],[["0x195ca54fda280d612697bca4ece9ccad903dd49920d9d9facad8a825920f6921", "0x264b6a42c5df1271a5258266dcef6c175c2510a81e6b349413aefd43ac818efc"],["0x2a112ff066960ac64ff0f36b23c5ab091deaa02e692a6b8b694be3b467ee1a8e", "0x1b0f3105f6553d108e80962fdb59aae75d829094d7957e2765fd961f15af6966"]],["0x245be77a089c362010e435749495b441dbb152b8cc64710090e8f3c5757b4183", "0x1bf05eebd84b8ed833cd8adcd5f906341ee26625679697cca54aaaa33ce6cf30"],["0x02fa1595684d9c4d2492b046a74237088bfdf9d2e74c7c363ba1ba13aba57336","0x0768a8ff526a23df7009692694a48ae687fa78e77369edb48103518ce809672a"]'
  const contractAddress = "0x59Bc776565ebC5d438A0BC16cD0B4443A79976f6";
  
  const secret = BigInt("0x" + getRandom254BitHex());
  const nullifier = BigInt("0x" + getRandom254BitHex());

  const abi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "leaf",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      inputs: [],
      name: "REWARD_AMOUNT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "leaf",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[2]",
          name: "_pA",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "_pB",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pC",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pubSignals",
          type: "uint256[2]",
        },
      ],
      name: "verifyAndReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[2]",
          name: "_pA",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "_pB",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pC",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pubSignals",
          type: "uint256[2]",
        },
      ],
      name: "verifyProof",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ];
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const REWARD_AMOUNT = ethers.utils.parseEther("0.01"); // 10^16 wei = 0.01 ETH
  const feeData = await provider.getFeeData();
  
  const gasEstimate = await contract.estimateGas.deposit(secret, { 
    value: REWARD_AMOUNT 
  });
  const gasLimit = gasEstimate.mul(120).div(100); 

  try {
    const tx = await contract.deposit(secret, {
      value: REWARD_AMOUNT,
      gasLimit,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });
    console.log(tx);

    const receipt = await tx.wait();
    showError("Transaction mined: " + receipt.transactionHash)
  } catch(e) {
    console.log(e);
  }


  //--------------------------------------
  // Generate ZK proof for this fundation

  console.log(secret);
  console.log(nullifier);
  const nullifierHash = poseidon([secret, nullifier]);
  console.log(nullifierHash);

  const root = BigInt(
    "0x37ccf772339bc4092859aedd1625e343b02e612fed235e45c4e54720d809672b"
  );
  let inclusionProof = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ];
  inclusionProof[0] = secret.toString(10);
  inclusionProof[1] = nullifier.toString(10);

  console.log(root);
  console.log(inclusionProof);

  const inputs = {
    nullifierHash: nullifierHash.toString(10),
    nullifier: nullifier.toString(10),
    secret: secret.toString(10),
    root: root.toString(10),
    inclusionProof: inclusionProof,
  };
  console.log(JSON.stringify(inputs));

  fetch("http://localhost:3005/prove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  })
    .then((response) => response.json())
    .then((data) => {
      downloadJSON(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  generateProofButton.disabled = false;

});

callContractButton.addEventListener("click", async () => {
  callContractButton.disabled = true;
  const calldataInput = document.getElementById("calldata-input");
  const calldata = calldataInput.value;
  // const calldata = '["0x226952847ae340d55fd5c10dd4a4dd15245e14a9c13f1cec41f3d33d680d1f13", "0x1f408457d1782e69cddf684ea5804de2e4650cd8adb12a5f21672c391c7e7765"],[["0x195ca54fda280d612697bca4ece9ccad903dd49920d9d9facad8a825920f6921", "0x264b6a42c5df1271a5258266dcef6c175c2510a81e6b349413aefd43ac818efc"],["0x2a112ff066960ac64ff0f36b23c5ab091deaa02e692a6b8b694be3b467ee1a8e", "0x1b0f3105f6553d108e80962fdb59aae75d829094d7957e2765fd961f15af6966"]],["0x245be77a089c362010e435749495b441dbb152b8cc64710090e8f3c5757b4183", "0x1bf05eebd84b8ed833cd8adcd5f906341ee26625679697cca54aaaa33ce6cf30"],["0x02fa1595684d9c4d2492b046a74237088bfdf9d2e74c7c363ba1ba13aba57336","0x0768a8ff526a23df7009692694a48ae687fa78e77369edb48103518ce809672a"]'
  const contractAddress = "0x59Bc776565ebC5d438A0BC16cD0B4443A79976f6";

  const abi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "leaf",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      inputs: [],
      name: "REWARD_AMOUNT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "leaf",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[2]",
          name: "_pA",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "_pB",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pC",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pubSignals",
          type: "uint256[2]",
        },
      ],
      name: "verifyAndReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[2]",
          name: "_pA",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "_pB",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pC",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2]",
          name: "_pubSignals",
          type: "uint256[2]",
        },
      ],
      name: "verifyProof",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ];
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const params = JSON.parse(`{"a":[${calldata}]}`).a
  const _pA = params[0];
  const _pB = params[1];
  const _pC = params[2];
  const _pubSignals = params[3];

  const gasLimit = await contract.estimateGas.verifyAndReward(_pA, _pB, _pC, _pubSignals);
  console.log(gasLimit);
  const feeData = await provider.getFeeData();
  console.log(feeData);
  console.log(_pA, _pB, _pC, _pubSignals);


  const tx = await contract.verifyAndReward(
    _pA,
    _pB,
    _pC,
    _pubSignals,
    {
      gasLimit: gasLimit.mul(120).div(100), 
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    }
  );

  console.log(tx);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  showError("Transaction mined:" + receipt.transactionHash);

  callContractButton.disabled = false;
});

//------------------------------------------------------------
// Setting

const logOutButton = document.getElementById("logout-button");
logOutButton.addEventListener("click", async () => {
  await browser.storage.local.set({ passwordHash: "" });
  await browser.storage.local.set({ mnemonic: "" });
  await browser.storage.local.set({ privateKey: "" });
  await browser.storage.local.set({ publicKey: "" });
  await browser.storage.local.set({ address: "" });
  await browser.storage.local.set({ localHistory: "" });
  console.log("clear");
  window.location.href = "register.html";
});

const copyPrivKeyButton = document.getElementById("copy-private-key");
copyPrivKeyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(privateKey);
  showError("Private key copied to clipboard!");
});

//------------------------------------------------------------
// Extension button
document.getElementById("openTabButton").addEventListener("click", async () => {
  const extensionURL = browser.runtime.getURL("utils/home.html");
  await browser.tabs.create({ url: extensionURL });
});
