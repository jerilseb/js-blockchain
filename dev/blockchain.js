const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.networkNodes = [];

        this.createNewBlock(100, '0', '0');
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        };
    
        this.pendingTransactions = [];
        this.chain.push(newBlock);
    
        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
  
    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuid().split('-').join('')
        };
    
        return newTransaction;
    };    

    addTransactionToPendingTransactions(transactionObj) {
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()['index'] + 1;
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 5) !== '00000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
    
        return nonce;
    };

    chainIsValid(blockchain) {
        let validChain = true;

        for(let i=1; i < blockchain.length; i++) {
            let currentBlock = blockchain[i];
            let prevBlock = blockchain[i-1];

            const blockHash = this.hashBlock(prevBlock["hash"], { 
                    transactions: currentBlock["transactions"], 
                    index: currentBlock["index"]
                },
                currentBlock["nonce"]
            );

            if(blockHash.substring(0,5) !== "00000") validChain = false;

            if(currentBlock["previousBlockHash"] !== prevBlock["hash"]) {
                validChain = false;
                break;
            }
        }

        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousHash = genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        return (correctNonce && correctPreviousHash && correctHash && correctTransactions && validChain);
    }
}

module.exports = Blockchain;