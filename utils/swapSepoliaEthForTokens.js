
async function swapSepoliaEthForTokens(amountInEth) {
    try {
        const routerContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);

        const amountInWei = ethers.utils.parseEther(amountInEth);
        const path = [WETH_ADDRESS, TOKEN_ADDRESS];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

        const amountOutMin = 0;

        console.log("Sending transaction...");
        const tx = await routerContract.swapExactETHForTokens(
            amountOutMin,
            path,
            await signer.getAddress(),
            deadline,
            {
                value: amountInWei,
                gasLimit: 300000 
            }
        );

        console.log(tx);
        return {txHash: tx.hash, amount: amountInEth, type: "swap"}
       
    } catch (error) {
        console.error("Error swapping tokens:", error);
    }
}