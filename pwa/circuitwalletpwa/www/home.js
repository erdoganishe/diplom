let localHistory = [];
let mnemonic = "soap foam account antenna machine spirit shadow inspire robust buzz behind basic";
let privateKey = "0xba20e5c629545af48ca4c3dfc0db0bf5d6e957b14baa483a2c3b18a4fecc6a5e";
let address = "0x36Da34c8c5d72b861d4edb4ADC13BE220e54855A";
let publicKey = "0x04d0c1c195ee1bd30caa9ae3b5d7eb66a4424f5814cc8f93839c4d462b56aee2917fa8045bc66d7496554ae2e6c214122d1f4dff7d5f687e1ea5af70db7058f015";
let cypherKey = "";
let INFURA_API_KEY = config.INFURA_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/" + INFURA_API_KEY
);
let signer;

document.addEventListener("DOMContentLoaded", async () => {
  // await browser.storage.local.set({localHistory: ""});

  // await getPassword()
  //   .then(async (password) => {
  //     if (password == "") {
  //       window.location.href = "login.html";
  //     }
  //     cypherKey = password;
  //     await getValueFromLocalStorage("mnemonic", password).then(
  //       (result) => (mnemonic = result)
  //     );
  //     await getValueFromLocalStorage("privateKey", password).then(
  //       (result) => (privateKey = result)
  //     );
  //     await getValueFromLocalStorage("publicKey", password).then(
  //       (result) => (publicKey = result)
  //     );
  //     await getValueFromLocalStorage("address", password).then(
  //       (result) => (address = result)
  //     );
  //     try {
  //       await getValueFromLocalStorage("localHistory", password).then(
  //         (result) => {
  //           localHistory = JSON.parse(result);
  //         }
  //       );
  //     } catch (error) {
  //       console.log("error while reading history!");
  //       console.log(error);
  //     }

  //     savePassword("");
  //   })
  //   .then(() => {
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
    // });
  let curBal = 0;
  try {
    await updateBalance();
  } catch (e){
    showError(e.toString());
  }
  showError(address);
  copyAddressButton.innerHTML = address.slice(0, 6) + "..." + address.slice(-4);

  // TODO: fix local history
  // TODO: add edge case for clear history
  buildGraph([
    {
      dateTime: 0,
      balance: 0,
    },
  ]);
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

// const sendPopupButton = document.getElementById("header-send-button");
// const receivePopupButton = document.getElementById("header-receive-button");
// const contractPopupButton = document.getElementById("header-contract-button");
// const swapPopupButton = document.getElementById("header-swap-button");
// const popupsContainers = document.getElementsByClassName("inner-popup");

// sendPopupButton.addEventListener("click", () => {
//   Array.from(popupsContainers).forEach((elem) => {
//     elem.classList.add("hidden");
//   });

//   const sendPopup = document.getElementById("send-popup");
//   sendPopup.classList.remove("hidden");
// });

// receivePopupButton.addEventListener("click", () => {
//   Array.from(popupsContainers).forEach((elem) => {
//     elem.classList.add("hidden");
//   });

//   const receivePopup = document.getElementById("receive-popup");
//   receivePopup.classList.remove("hidden");
// });

// swapPopupButton.addEventListener("click", () => {
//   Array.from(popupsContainers).forEach((elem) => {
//     elem.classList.add("hidden");
//   });

//   const swapPopup = document.getElementById("swap-popup");
//   swapPopup.classList.remove("hidden");
// });

// contractPopupButton.addEventListener("click", () => {
//   Array.from(popupsContainers).forEach((elem) => {
//     elem.classList.add("hidden");
//   });

//   const contractPopup = document.getElementById("contract-popup");
//   contractPopup.classList.remove("hidden");
// });

//------------------------------------------------------------
// Close popups

// const sendClosePopupButton = document.getElementById("send-close-button");
// const receiveClosePopupButton = document.getElementById("receive-close-button");
// const contractClosePopupButton = document.getElementById(
//   "contract-close-button"
// );
// const swapClosePopupButton = document.getElementById("swap-close-button");

// sendClosePopupButton.addEventListener("click", () => {
//   const sendPopup = document.getElementById("send-popup");
//   sendPopup.classList.add("hidden");
// });

// receiveClosePopupButton.addEventListener("click", () => {
//   const receivePopup = document.getElementById("receive-popup");
//   receivePopup.classList.add("hidden");
// });

// contractClosePopupButton.addEventListener("click", () => {
//   const contractPopup = document.getElementById("contract-popup");
//   contractPopup.classList.add("hidden");
// });

// swapClosePopupButton.addEventListener("click", () => {
//   const contractPopup = document.getElementById("swap-popup");
//   contractPopup.classList.add("hidden");
// });

//------------------------------------------------------------
// Footer buttons setup
// const footerHomeButton = document.getElementById("footer-home-button");
const footerHistoryButton = document.getElementById("footer-history-button");
// const footerVotingButton = document.getElementById("footer-voting-button");
// const footerSettingsButton = document.getElementById("footer-settings-button");
// const footerButtons = document.getElementsByClassName("footer-button");
// const mainContentDivs = document.getElementsByClassName("main-content-div");

// footerHomeButton.addEventListener("click", async () => {
//   Array.from(mainContentDivs).forEach((elem) => {
//     elem.classList.add("hidden");
//   });

//   await updateLocalHistory();

//   Array.from(footerButtons).forEach((elem) => {
//     elem.classList.remove("active");
//     elem.children[0].src = elem.children[0].src
//       .toString()
//       .replaceAll("_active", "");
//   });
//   footerHomeButton.classList.add("active");
//   footerHomeButton.children[0].src =
//     footerHomeButton.children[0].src.toString().slice(0, -4) + "_active.png";
// });

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

// footerVotingButton.addEventListener("click", () => {
//   const proofContainer = document.getElementById("proof-container");

//   Array.from(mainContentDivs).forEach((elem) => {
//     elem.classList.add("hidden");
//   });
//   proofContainer.classList.remove("hidden");

//   Array.from(footerButtons).forEach((elem) => {
//     elem.classList.remove("active");
//     elem.children[0].src = elem.children[0].src
//       .toString()
//       .replaceAll("_active", "");
//   });
//   footerVotingButton.classList.add("active");
//   footerVotingButton.children[0].src =
//     footerVotingButton.children[0].src.toString().slice(0, -4) +
//     "_active.png";
// });

// footerSettingsButton.addEventListener("click", () => {
//   const settingsContainer = document.getElementById("settings-container");

//   Array.from(mainContentDivs).forEach((elem) => {
//     elem.classList.add("hidden");
//   });
//   settingsContainer.classList.remove("hidden");

//   Array.from(footerButtons).forEach((elem) => {
//     elem.classList.remove("active");
//     elem.children[0].src = elem.children[0].src
//       .toString()
//       .replaceAll("_active", "");
//   });
//   footerSettingsButton.classList.add("active");
//   footerSettingsButton.children[0].src =
//     footerSettingsButton.children[0].src.toString().slice(0, -4) +
//     "_active.png";
// });

//------------------------------------------------------------
// // Send tx
// const sendTxButton = document.getElementById("send-tx-button");
// sendTxButton.addEventListener("click", async () => {
//   sendTxButton.disabled = true;
//   const sendAddressInput = document.getElementById("send-address-input");
//   const sendAmountInput = document.getElementById("send-amount-input");

//   if (!sendAddressInput.value) {
//     showError("Put address!");
//     sendTxButton.disabled = false;
//     return;
//   }
//   if (!sendAmountInput.value) {
//     showError("Put value!");
//     sendTxButton.disabled = false;
//     return;
//   }

//   await sendTransaction(
//     await sendTransaction(
//       sendAddressInput.value,
//       sendAmountInput.value.toString(),
//       signer
//     )
//       .then(async (result) => {
//         localHistory.push(result);
//         if (footerHomeButton.classList.contains("active")) {
//           await updateLocalHistory();
//         }
//         document.getElementById("send-popup").classList.add("hidden");
//         await updateBalance();
//       })
//       .catch((error) => {
//         console.error("Transaction failed:", error);
//         showError("An error occurred while sending the transaction.");
//       })
//       .finally(() => {
//         sendTxButton.disabled = false;
//       })
//   );
// });

// //------------------------------------------------------------
// // Deploy contract
// const abiInput = document.getElementById("contract-abi-input");
// const bytecodeInput = document.getElementById("contract-bytecode-input");
// const deployContractButton = document.getElementById("contract-delploy");
// deployContractButton.addEventListener("click", async () => {
//   deployContractButton.disabled = true;
//   try {
//     await deploySmartContract(
//       bytecodeInput.value,
//       JSON.parse(abiInput.value)
//     ).then(async (result) => {
//       localHistory.push(result);
//       if (footerHomeButton.classList.contains("active")) {
//         await updateLocalHistory();
//       }
//       const contractPopup = document.getElementById("contract-popup");
//       contractPopup.classList.add("hidden");
//       await updateBalance();
//     });
//   } catch {
//     showError("Something went wrong");
//     deployContractButton.disabled = false;
//   }
// });
// //------------------------------------------------------------
// // Swap

// const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
// const UNISWAP_ROUTER_ABI = [
//   "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
// ];
// const WETH_ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
// const TOKEN_ADDRESS = "0x7169d38820dfd117c3fa1f22a697dba58d90ba06";

// const swapButton = document.getElementById("swap-token-button");
// const swapAmountInput = document.getElementById("swap-amount-input");
// swapButton.addEventListener("click", async () => {
//   swapButton.disabled = true;
//   const amountInEth = swapAmountInput.value;
//   await swapSepoliaEthForTokens(amountInEth).then(async (result) => {
//     localHistory.push(result);
//     if (footerHomeButton.classList.contains("active")) {
//       await updateLocalHistory();
//     }
//     const contractPopup = document.getElementById("swap-popup");
//     contractPopup.classList.add("hidden");
//     await updateBalance();
//     swapButton.disabled = false;
//   });
// });

//------------------------------------------------------------
// Local History

// async function updateLocalHistory() {
//   const localHistoryContainer = document.getElementById(
//     "local-history-container"
//   );
//   localHistoryContainer.classList.remove("hidden");
//   localHistoryContainer.innerHTML = "";

//   console.log(localHistory.length);

//   if (localHistory.length == 0){
//     console.log(1);
//     localHistoryContainer.innerHTML = "No operation yet!";
//   }


//   console.log(localHistory);
//   localHistory.forEach((elem) => {
//     const historyElem = document.createElement("div");
//     // TODO: Add some more to div (class, children, etc)
//     switch (elem.type) {
//       case "swap": {
//         historyElem.classList.add("local-history-elem-swap");

//         const img = document.createElement("img");
//         img.src = "../assets/swap.png";

//         const paramsDiv = document.createElement("div");
//         paramsDiv.classList.add("to-center-div", "fixed-width");

//         const recepientDiv = document.createElement("div");
//         recepientDiv.classList.add("local-history-elem-tx-hash");
//         recepientDiv.innerHTML =
//           elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
//         recepientDiv.addEventListener("click", () => {
//           navigator.clipboard.writeText(elem.txHash);
//         });
        
//         paramsDiv.appendChild(recepientDiv);

//         const amountDiv = document.createElement("div");
//         amountDiv.classList.add(
//           "fixed-width",
//           "div-to-right"
//         );
        

//         historyElem.appendChild(img);
//         historyElem.appendChild(paramsDiv);
//         historyElem.appendChild(amountDiv);

//         break;
//         // historyElem.innerHTML = elem.txHash + " " + elem.amount + " ETH";
//         // break;
//       }
//       case "send": {
//         historyElem.classList.add("local-history-elem-tx");

//         const img = document.createElement("img");
//         img.src = "../assets/send.png";

//         const paramsDiv = document.createElement("div");
//         paramsDiv.classList.add("to-center-div", "fixed-width");

//         const recepientDiv = document.createElement("div");
//         recepientDiv.classList.add("local-history-elem-tx-recepint");
//         recepientDiv.innerHTML =
//           elem.to.slice(0, 6) + "..." + elem.to.slice(-4);
//         recepientDiv.addEventListener("click", () => {
//           navigator.clipboard.writeText(elem.to);
//         });
//         const txHashDiv = document.createElement("div");
//         txHashDiv.classList.add("local-history-elem-tx-hash");
//         txHashDiv.innerHTML =
//           elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
//         txHashDiv.addEventListener("click", () => {
//           navigator.clipboard.writeText(elem.txHash);
//         });
//         paramsDiv.appendChild(recepientDiv);
//         paramsDiv.appendChild(txHashDiv);

//         const amountDiv = document.createElement("div");
//         amountDiv.classList.add(
//           "local-history-elem-tx-amount",
//           "fixed-width",
//           "div-to-right"
//         );
//         amountDiv.innerHTML =
//           parseFloat(elem.value).toFixed(4).toString() + " SepoliaETH";

//         historyElem.appendChild(img);
//         historyElem.appendChild(paramsDiv);
//         historyElem.appendChild(amountDiv);

//         break;
//       }
//       case "contract": {
//         historyElem.classList.add("local-history-elem-contract");

//         const img = document.createElement("img");
//         img.src = "../assets/smart.png";

//         const paramsDiv = document.createElement("div");
//         paramsDiv.classList.add("to-center-div", "fixed-width");

//         const recepientDiv = document.createElement("div");
//         recepientDiv.classList.add("local-history-elem-tx-recepint");
//         recepientDiv.innerHTML =
//           "Status: "+ elem.status? "Success!" : "Revert!";
//         const txHashDiv = document.createElement("div");
//         txHashDiv.classList.add("local-history-elem-tx-hash");
//         txHashDiv.innerHTML =
//           elem.txHash.slice(0, 6) + "..." + elem.txHash.slice(-4);
//         txHashDiv.addEventListener("click", () => {
//           navigator.clipboard.writeText(elem.txHash);
//         });
//         paramsDiv.appendChild(recepientDiv);
//         paramsDiv.appendChild(txHashDiv);

//         const amountDiv = document.createElement("div");
//         amountDiv.classList.add(
//           "fixed-width",
//           "div-to-right"
//         );

//         historyElem.appendChild(img);
//         historyElem.appendChild(paramsDiv);
//         historyElem.appendChild(amountDiv);

//         break;
//         // historyElem.innerHTML = elem.txHash + " " + elem.status;
//         // break;
//       }
//       default: {
//         break;
//       }
//     }

//     localHistoryContainer.appendChild(historyElem);
//   });

  

  // await putValueToLocalStorage(
  //   "localHistory",
  //   JSON.stringify(localHistory),
  //   cypherKey
  // );
// }

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
// const generateProofButton = document.getElementById("generate-proof-button");
// generateProofButton.addEventListener("click", async () => {
//   const inputs = {
//     nullifierHash: 14744269619966411208579211824598458697587494354926760081771325075741142829156n,
//     nullifier: 0,
//     secret: 0,
//     root: 1,
//     inclusionProof: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//   }

//   const wasmPath = chrome.runtime.getURL("artifacts/m.wasm");
//   const zkeyPath = chrome.runtime.getURL("artifacts/circuit_final.zkey");
//   // fetch(wasmPath)
//   // .then(response => response.arrayBuffer())
//   // .then(buffer => {
//   //   const bytes = new Uint8Array(buffer);
//   //   console.log(bytes); // bytes of the file
//   // })
//   // fetch(zkeyPath)
//   // .then(response => response.arrayBuffer())
//   // .then(buffer => {
//   //   const bytes = new Uint8Array(buffer);
//   //   console.log(bytes); // bytes of the file
//   // })
//   // .catch(err => console.error('Error loading file:', err));
//   console.log(wasmPath, zkeyPath);
//   const { proof, publicSignals } =
//   await snarkjs.groth16.fullProve( inputs, wasmPath, zkeyPath);
//   console.log(proof, publicSignals);
//   proofComponent = document.getElementById("proof");
//   proofComponent.innerHTML = JSON.stringify(proof, null, 1);


//   // const vkey = await fetch("verification_key.json").then( function(res) {
//   //     return res.json();
//   // });

//   // const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

//   // resultComponent.innerHTML = res;
// });

// //------------------------------------------------------------
// // Setting

// const logOutButton = document.getElementById("logout-button");
// logOutButton.addEventListener("click", async () => {
//   // await browser.storage.local.set({ passwordHash: "" });
//   // await browser.storage.local.set({ mnemonic: "" });
//   // await browser.storage.local.set({ privateKey: "" });
//   // await browser.storage.local.set({ publicKey: "" });
//   // await browser.storage.local.set({ address: "" });
//   // await browser.storage.local.set({ localHistory: "" });
//   console.log("clear");
//   window.location.href = "register.html";
// });

// const copyPrivKeyButton = document.getElementById("copy-private-key");
// copyPrivKeyButton.addEventListener("click", () => {
//   navigator.clipboard.writeText(privateKey);
//   showError("Private key copied to clipboard!");
// });

// //------------------------------------------------------------
// // Extension button
// document.getElementById("openTabButton").addEventListener("click", async () => {
//   const extensionURL = browser.runtime.getURL("utils/home.html");
//   await browser.tabs.create({ url: extensionURL });
// });
