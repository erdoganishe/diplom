async function deploySmartContract(bytecode, abi){
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    try {
        console.log('Deploying contract...');
        const contract = await factory.deploy({ gasLimit: 300000 });
        console.log('Transaction hash:', contract.deployTransaction.hash);
        try {
          await contract.deployed();
          return {txHash: contract.deployTransaction.hash, status: true};
        } catch(e) {
          showError("Contract deployed, but revert occured!");
          return {type: "contract", txHash: contract.deployTransaction.hash, status: false};
        }
    } catch (error) {
        console.error('Error deploying contract:', error.message);
    }
}
