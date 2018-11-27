const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1543327518636,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1543327627318,
            "transactions": [
                {
                    "amount": 200,
                    "sender": "ASDSDGEWFSDFSDFeSDF",
                    "recipient": "DSFSFDFdDF@##F@#",
                    "transactionId": "8e058490f24d11e88cc2913e1b915448"
                },
                {
                    "amount": 200,
                    "sender": "ASDSDGEWFSDFSDFeSDF",
                    "recipient": "DSFSFDFdDF@##F@#",
                    "transactionId": "adb69db0f24d11e88cc2913e1b915448"
                }
            ],
            "nonce": 1888209,
            "hash": "00000d393f62ed6123d7dfbfacc141b69d603e324f7cd27a48637f184a18bd93",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1543327660025,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "78b56ec0f24d11e88cc2913e1b915448",
                    "transactionId": "b97f2040f24d11e88cc2913e1b915448"
                },
                {
                    "amount": 80,
                    "sender": "ASDSDGEWFSDFSDFeSDF",
                    "recipient": "DSFSFDFdDF@##F@#",
                    "transactionId": "c7454790f24d11e88cc2913e1b915448"
                }
            ],
            "nonce": 869818,
            "hash": "000006d5646ced885915ce20b5416660a419ccf753b68c1a5fef6ba3dbfd0bdf",
            "previousBlockHash": "00000d393f62ed6123d7dfbfacc141b69d603e324f7cd27a48637f184a18bd93"
        },
        {
            "index": 4,
            "timestamp": 1543327820046,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "78b56ec0f24d11e88cc2913e1b915448",
                    "transactionId": "ccfce710f24d11e88cc2913e1b915448"
                }
            ],
            "nonce": 838791,
            "hash": "000005e28628353598e04a13e8cf2bdf70049fd5c744244ea84213eeacf148a2",
            "previousBlockHash": "000006d5646ced885915ce20b5416660a419ccf753b68c1a5fef6ba3dbfd0bdf"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "78b56ec0f24d11e88cc2913e1b915448",
            "transactionId": "2c5ddd40f24e11e88cc2913e1b915448"
        }
    ],
    "currentNodeUrl": "http://localhost:3002",
    "networkNodes": []
}

console.log(bitcoin.chainIsValid(bc1.chain));