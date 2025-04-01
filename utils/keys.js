function generateAll(){
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    const priv = wallet.privateKey;
    const pub = wallet.publicKey;
    const addr = wallet.address;

    return {mnemonic:mnemonic, privateKey:priv, publicKey:pub, address:addr}
}

function getCheckPhrase(count, max, phrase) {
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * (max + 1)));
    }
    numbers.forEach((num)=>{
        phrase[num] = "";
    });

    return {phrase: phrase, indexes: numbers};
}

// const res = generateAll();
// console.log(res)
// console.log(getCheckPhrase(4, 11, res.mnemonic.split(" ")));

