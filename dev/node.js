const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const axios = require("axios");

const port = process.argv[2];
if(!port) throw new Error("No port given");

const app = express();
const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

// create a new transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});


app.post('/transaction/broadcast', async (req, res) => {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requests = bitcoin.networkNodes.map(networkNodeUrl => axios({
		url: networkNodeUrl + '/transaction',
		method: 'POST',
		data: newTransaction
	}));

	await axios.all(requests);

	res.json({ note: 'Transaction created and broadcast successfully.' });
});


app.get('/mine', async (req, res) => {
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
	console.log(newBlock);

	const requests = bitcoin.networkNodes.map(networkNodeUrl => axios({
		url: networkNodeUrl + '/receive-new-block',
		method: 'POST',
		data: { newBlock }
	}));

	await axios.all(requests);

	await axios({
		url: bitcoin.currentNodeUrl + '/transaction/broadcast',
		method: 'POST',
		data: {
			amount: 12.5,
			sender: "00",
			recipient: nodeAddress
		}
	});

	res.json({
		note: "New block mined & broadcast successfully",
		block: newBlock
	});
});

app.post('/receive-new-block', function(req, res) {
	console.log("body is ", req.body);
	const { newBlock } = req.body;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

app.post('/register-and-broadcast-node', async (req, res) => {
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.currentNodeUrl !== newNodeUrl && bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const requests = bitcoin.networkNodes.map(networkNodeUrl => axios({
		url: networkNodeUrl + '/register-node',
		method: 'POST',
		data: { newNodeUrl }		
	}));

	await axios.all(requests);

	await axios({
		url: newNodeUrl + '/register-nodes-bulk',
		method: 'POST',
		data: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
	});

	res.json({ note: 'New node registered with network successfully.' });
});

// register a node with the network
app.post('/register-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});


app.get('/consensus', async (req, res) => {
	const requests = bitcoin.networkNodes.map(networkNodeUrl => axios({
		url: networkNodeUrl + '/blockchain',
		method: 'GET'
	}));

	const blockchains = await axios.all(requests);
	console.log(blockchains);

	let maxChainLength = bitcoin.chain.length;;
	let newLongestChain = null;
	let newPendingTransactions = null;

	blockchains.forEach(({ data }) => {
		if (data.chain.length > maxChainLength) {
			maxChainLength = data.chain.length;
			newLongestChain = data.chain;
			newPendingTransactions = data.pendingTransactions;
		};
	});


	if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
		res.json({
			note: 'Current chain has not been replaced.',
			chain: bitcoin.chain
		});
	}
	else {
		bitcoin.chain = newLongestChain;
		bitcoin.pendingTransactions = newPendingTransactions;
		res.json({
			note: 'This chain has been replaced.',
			chain: bitcoin.chain
		});
	}

});


app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});




