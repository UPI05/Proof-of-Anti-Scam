const utils = require("./utils");
const math = require("mathjs");
const {
  MSG_TYPE,
  GENESIS_HASH,
  GENESIS_OTHERS,
  GENESIS_PROPOSER,
  GENESIS_SIGNATURE,
  GENESIS_TIMESTAMP,
  DEBUG,
} = require("./config");

class Message {
  constructor(materials, wallet, msgType) {
    // General

    this.timeStamp = materials.timeStamp || Date.now();
    this.msgType = msgType || "";
    this.publicKey = wallet.getPublicKey() || "";

    const hashInpStr = this.timeStamp + this.msgType + this.publicKey;

    // For genesisBlock

    if (msgType === MSG_TYPE.genesisBlock) {
      this.timeStamp = GENESIS_TIMESTAMP;
      this.publicKey = GENESIS_PROPOSER;
      this.others = GENESIS_OTHERS;
      this.messages = { ...materials.message } || {};
      this.hash = GENESIS_HASH;
    }

    // For transaction

    if (msgType === MSG_TYPE.transaction) {
      this.messages = { ...materials } || {};
      this.hash = utils.hash(hashInpStr + this.messages);
    }

    // Prepare request message

    if (msgType === MSG_TYPE.prepareReqMsg) {
      this.IPHash = materials.IPHash || "";
      this.hash = utils.hash(hashInpStr + this.IPHash);
    }

    // Block with IP request

    if (msgType === MSG_TYPE.blockWithIPReq) {
      this.prepareReqMsg = materials.prepareReqMsg || "";
      this.hash = utils.hash(hashInpStr + this.prepareReqMsg);
    }

    // Block Commit

    if (msgType === MSG_TYPE.blockCommit) {
      this.IP = materials.IP || "";
      this.messages = materials.messages || [];
      this.hash = utils.hash(hashInpStr + this.IP + this.messages);
    }

    // Local blockCommit

    if (msgType === MSG_TYPE.localBlockCommit) {
      this.IP = materials.IP || "";
      this.messages = materials.messages || [];
      this.hash = utils.hash(hashInpStr + this.IP + this.messages);
    }

    // Heart beat request

    if (msgType === MSG_TYPE.heartBeatReq) {
      this.hash = utils.hash(hashInpStr);
    }

    // Heart beat response

    if (msgType === MSG_TYPE.heartBeatRes) {
      this.heartBeatReq = materials.heartBeatReq || {};
      this.hash = utils.hash(hashInpStr + this.heartBeatReq);
    }

    // Signature
    this.signature =
      msgType === MSG_TYPE.genesisBlock
        ? GENESIS_SIGNATURE
        : wallet.sign(this.hash);
  }

  // Verify message integrity
  static verifyMsgIntergrity(msg) {
    const hashInpStr = msg.timeStamp + msg.msgType + msg.publicKey;
    switch (msg.msgType) {
      case MSG_TYPE.transaction:
        return utils.hash(hashInpStr + msg.messages) === msg.hash;

      case MSG_TYPE.prepareReqMsg:
        return utils.hash(hashInpStr + msg.IPHash) === msg.hash;

      case MSG_TYPE.blockWithIPReq:
        return utils.hash(hashInpStr + msg.prepareReqMsg) === msg.hash;

      case MSG_TYPE.blockCommit:
        return utils.hash(hashInpStr + msg.IP + msg.messages) === msg.hash;

      case MSG_TYPE.heartBeatReq:
        return utils.hash(hashInpStr) === msg.hash;

      case MSG_TYPE.heartBeatRes:
        return utils.hash(hashInpStr + msg.heartBeatReq) === msg.hash;

      default:
        console.info("oops");
        return false;
    }
  }
  static verifySenderAndMsgIntegrity(msg, blockchain) {
    // Verify message integrity
    if (!this.verifyMsgIntergrity(msg)) return false;

    // Verify signature
    if (
      !utils.verifySignature(
        msg.publicKey || "",
        msg.signature || "",
        msg.hash || ""
      )
    )
      return false;

    return true;
  }

  static verify(msg, blockchain) {
    if (DEBUG) console.info(`verified: ${msg.msgType}`);
    // General
    if (!this.verifySenderAndMsgIntegrity(msg, blockchain)) return false;

    // For transaction

    if (msg.msgType === MSG_TYPE.transaction) {
    }




    // For prepare request msg




    // Block with IP request



    // Block commit

    if (msg.msgType === MSG_TYPE.blockCommit) {
      // Check if IP matches IP Pattern

      // Check if IP is detected as phishing

      // Check if owner is in front of queue

    }

    return true;
  }
}

module.exports = Message;
