const generateProofButton = document.getElementById("generate-proof-button");
generateProofButton.addEventListener("click", async () => {
  const inputs = {
    nullifierHash: 14744269619966411208579211824598458697587494354926760081771325075741142829156n,
    nullifier: 0,
    secret: 0,
    root: 1,
    inclusionProof: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  }
  const { proof, publicSignals } =
  await snarkjs.groth16.fullProve( inputs, "../artifacts/m.wasm", "../artifacts/circuit_final.zkey");

  proofComponent.innerHTML = JSON.stringify(proof, null, 1);


  const vkey = await fetch("verification_key.json").then( function(res) {
      return res.json();
  });

  const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

  resultComponent.innerHTML = res;
});