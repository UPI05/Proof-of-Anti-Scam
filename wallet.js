const utils = require("./utils");
const Message = require("./message");
const { MSG_TYPE } = require("./config");

class Wallet {
  constructor(secret) {
    this.keyPair = utils.genKeyPair(secret);
    this.publicKey = this.keyPair.getPublic("hex");
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash).toHex();
  }

  getPublicKey() {
    return this.publicKey;
  }

  // 

  createTransaction(data) {
    return new Message({ ...data }, this, MSG_TYPE.transaction);
  }

}

module.exports = Wallet;
