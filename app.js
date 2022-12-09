const express = require("express");
const bodyParser = require("body-parser");

const P2pServer = require("./p2p-server");
const Blockchain = require("./blockchain");
const Wallet = require("./wallet");
const MessagePool = require("./message-pool");
const Message = require("./message");

const HTTP_PORT = process.env.HTTP_PORT;
const { MSG_TYPE, HEARTBEAT_TIMEOUT } = require("./config");

const app = express();

const wallet = new Wallet(process.env.SECRET);
const blockchain = new Blockchain(wallet);
const messagePool = new MessagePool();
const p2pServer = new P2pServer(blockchain, wallet, messagePool);

app.use(bodyParser.json());

app.post("/request", (req, res) => {
    const transaction = wallet.createTransaction(req.body);
    p2pServer.broadcastMessage(transaction);
    res.json(transaction);
})

app.get("/message", (req, res) => {
    res.json(messagePool.getAll());
})

app.get("/blockchain", (req, res) => {
    res.json(blockchain.getAll());
})

app.listen(HTTP_PORT, () => {
    console.info(`HTTP listening on port ${HTTP_PORT}`);
})

p2pServer.listen();