const Message = require("./message");
const { MSG_TYPE } = require("./config");
const math = require("mathjs");

class MessagePool {
  constructor() {
    this.messages = [];
  }

  // General

  addMessage(msg) {
    this.messages.push(msg);
  }

  getAll() {
    return this.messages;
  }

  deleteMessage(hash) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.messages[i].hash === hash) this.messages.splice(i, 1);
    }
  }

  verifyMessage(msg, blockchain) {
    return Message.verify(msg, blockchain);
  }

  getTransactions() {
    let res = [];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.transaction && !msg.isSpent) {
        res.push(msg);
      }
    }
    return res;
  }

  messageExistsWithHash(message) {
    for (const msg of this.messages) {
      if (msg.hash === message.hash && !msg.isSpent) return true;
    }
    return false;
  }

  getPrepareMsg() {
    let res = [];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.prepareReqMsg && !msg.isSpent) res.push(msg);
    }
    return res;
  }

  getLocalBlockCommit() {
    let res = [];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.localBlockCommit && !msg.isSpent)
        res.push(msg);
    }
    return res;
  }

  clearPrepareMsg() {
    for (const msg of this.messages) {
      if (
        (msg.msgType === MSG_TYPE.prepareReqMsg ||
          msg.msgType === MSG_TYPE.blockWithIPReq) &&
        !msg.isSpent
      )
        msg.isSpent = true;
    }
  }

  removeFrontPrepareMsg() {
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.prepareReqMsg && !msg.isSpent) {
        msg.isSpent = true;
        break;
      }
    }
  }

  getBlockWithIPReq(prepareReqMsg) {
    let res = [];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.blockWithIPReq && !msg.isSpent && msg.prepareReqMsg === prepareReqMsg) res.push(msg);
    }
    return res;
  }

  getHeartBeatResMsgs(heartBeatReq) {
    let res = [];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.heartBeatRes && !msg.isSpent && msg.heartBeatReq === heartBeatReq) res.push(msg);
    }
    return res;
  }
}

module.exports = MessagePool;
