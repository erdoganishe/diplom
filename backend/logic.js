const snarkjs = require("snarkjs");
const { ethers } = require("ethers");
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
);


async function prove(inputs) {

const input = {
  nullifierHash: BigInt(inputs.nullifierHash),
  nullifier:BigInt(inputs.nullifier),
  secret: BigInt(inputs.secret),
  root: BigInt(inputs.root),
  inclusionProof: [0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n,0n]
}

  res = await snarkjs.groth16.fullProve(
    input,
    "artifacts/m.wasm",
    "artifacts/circuit_final.zkey"
  );
  // console.log(res);
  const calldata = await snarkjs.groth16.exportSolidityCallData(res.proof, res.publicSignals);
  console.log(calldata);
  return calldata;
}

module.exports = prove;
