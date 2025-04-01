async function sendTransaction(toAddress, amount) {
    const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount), 
        gasLimit: 21000,
    };

    try {
        const transaction = await signer.sendTransaction(tx);
        const receipt = await transaction.wait();
        const block = await provider.getBlock(receipt.blockNumber);
        return {to: toAddress, value: amount, timestamp: new Date(block.timestamp * 1000).toISOString().replace('T', ' ').replace('Z', ''), txHash: receipt.transactionHash}
    } catch (error) {
        // TODO: Catch errors
        alert('Transaction failed:', error);
    }
}