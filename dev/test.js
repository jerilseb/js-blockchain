const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(32244, "asdfsfsfwefwefwefsd", "sdfsdfwesfwefewgwgwe");

bitcoin.createNewTransaction(100, "ALEX324765", "JEN3434534");

bitcoin.createNewBlock(43543, "sdfgdfgwefwsdcsdsdf", "dfhlrtkjsvnowivubwwe");

bitcoin.createNewTransaction(400, "ALEX324765", "JEN3434534");
bitcoin.createNewTransaction(600, "ALEX324765", "JEN3434534");


console.log(bitcoin);
