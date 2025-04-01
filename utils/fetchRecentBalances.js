
async function getBalanceAtBlock(address, blockNumber) {
    const balance = await provider.getBalance(address, blockNumber);
    return ethers.utils.formatEther(balance);
}


async function fetchRecentBalances(address, amount, freq) {
    const currentBlock = await provider.getBlockNumber();
    const balances = [];

    for (let i = amount; i >= 0; i--) {
        const blockNumber = currentBlock - i * freq;
        const balance = await getBalanceAtBlock(address, blockNumber);
        const block = await provider.getBlock(blockNumber);
        const timestamp = block.timestamp;

        const dateTime = new Date(timestamp * 1000).toISOString().replace('T', ' ').replace('Z', '');

        balances.push({ dateTime, balance });
    }
    console.log(balances)
    return balances
    
}


