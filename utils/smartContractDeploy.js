const { error } = require("console");

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
          //TODO: catch errors
          console.log(e);
          return {txHash: contract.deployTransaction.hash, status: false};
        }
    } catch (error) {
        console.error('Error deploying contract:', error.message);
    }
}
