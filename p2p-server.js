const WebSocket = require("ws");
const utils = require("./utils");
const Message = require("./message");

const {
  MSG_TYPE,
  PREPARE_MSG_TIMEOUT,
  DEBUG,
  NUM_OF_TXS_IN_A_BLOCK,
} = require("./config.js");

const Peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const P2P_PORT = process.env.P2P_PORT;

class P2pServer {
  constructor(blockchain, wallet, messagePool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.messagePool = messagePool;
  }

  // WebSocket Connection

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => {
      console.info("New connection");
      this.handleConnection(socket);
    });
    this.connectToPeers();
  }

  async controller() {
    while (true) {
      let prepareMsgs = this.messagePool.getPrepareMsg();
      if (prepareMsgs.length === 0) continue;
      let blockWithIPReq = new Message(
        { toWhom: prepareMsgs[0].publicKey },
        this.wallet,
        MSG_TYPE.blockWithIPReq
      );
      this.broadcastMessage(blockWithIPReq);
      await new Promise((r) => setTimeout(r, PREPARE_MSG_TIMEOUT * 1000));
      let afterPreparesMsgs = this.messagePool.getPrepareMsg();
      if (afterPreparesMsgs && afterPreparesMsgs[0] === prepareMsgs[0]) {
        this.messagePool.removeFrontPrepareMsg();
      }
    }
  }

  connectToPeers() {
    Peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on("open", () => this.handleConnection(socket));
    });
  }

  handleConnection(socket) {
    this.sockets.push(socket);
    console.info("Socket connected");
    this.handleMessage(socket);
  }

  // Broadcast messages

  broadcastMessage(msg) {
    this.sockets.forEach((socket) => {
      this.sendMessage(msg, socket);
    });
  }

  sendMessage(msg, socket) {
    socket.send(
      JSON.stringify({
        type: msg.msgType || "",
        data: msg,
      })
    );
  }

  // The consensus protocol

  handleMessage(socket) {
    socket.on("message", async (message) => {
      message = JSON.parse(message);
      const msg = message.data;

      if (DEBUG) console.info(`received: ${msg.msgType}`);
      switch (message.type) {
        case MSG_TYPE.transaction:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            console.info("received tx");
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            let txs = this.messagePool.getTransactions();

            if (txs.length === NUM_OF_TXS_IN_A_BLOCK) {
              let foundIP = await this.blockchain.bruteforceIPPattern(
                this.blockchain.generateIPPattern()
              );
              let prepareRequestMsg = new Message(
                { IPHash: utils.hash(foundIP) },
                this.wallet,
                MSG_TYPE.prepareReqMsg
              );
              this.broadcastMessage(prepareRequestMsg);
              let blockCommit = new Message(
                { IP: foundIP, messages: txs },
                this.wallet,
                MSG_TYPE.localBlockCommit
              );
              blockCommit.isSpent = false;
              this.messagePool.addMessage(blockCommit);

              // mark txs as spent and consider >=
            }
          }

          break;
        case MSG_TYPE.prepareReqMsg:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);
          }

          break;
        case MSG_TYPE.blockWithIPReq:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);
            if (msg.toWhom === this.wallet.getPublicKey()) {
              let localBlockCommit = this.messagePool.getLocalBlockCommit();
              localBlockCommit = localBlockCommit[localBlockCommit.length - 1];
              localBlockCommit.msgType = MSG_TYPE.blockCommit;
              this.broadcastMessage(localBlockCommit);
            }
          }
        case MSG_TYPE.blockCommit:
          let prepareMsgs = this.messagePool.getPrepareMsg();
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            msg.publicKey === prepareMsgs[prepareMsgs.length - 1].publicKey
          ) {
            this.blockchain.push(msg);
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            // Need to reset genblock

            this.messagePool.clearPrepareMsg();
          }
        default:
          console.info("oops!");
      }
    });
  }
}

module.exports = P2pServer;
