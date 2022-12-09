const Message = require("./message");
const {  MSG_TYPE, GENESIS_OTHER, NUM_OF_KNOWN_BIT } = require("./config");

const dotenv = require("dotenv").config();

class Blockchain {
  constructor(wallet) {
    this.wallet = wallet;
    this.chain = [this.genesis()];
  }

  genesis() {
    const message = {
      genesisData: "Hello world!",
    };
    const genesisBlock = new Message(
      { message },
      this.wallet,
      MSG_TYPE.genesisBlock
    );
    return genesisBlock;
  }

  generateIPPattern() {
    let numOfKnownBit = Math.min(NUM_OF_KNOWN_BIT, this.chain.length);
    let ipPattern = "________________________________";
    console.info(JSON.stringify(this.chain[0]).length);
    for (let i = 0; i < numOfKnownBit; i++) {
      let pos = (JSON.stringify(this.chain[i]).length + JSON.stringify(this.chain[this.chain.length - 1]).length) % 32;
      let val = (JSON.stringify(this.chain[i].messages).length + JSON.stringify(this.chain[this.chain.length - 1].messages).length) % 2;
      let valueSet = false;
      for (let j = pos; j < 32; j++) {
        if (ipPattern[j] === "_") {
          ipPattern = ipPattern.substring(0, j) + (val === 0 ? "0" : "1") + ipPattern.substring(j + 1);
          valueSet = true;
          break;
        }
      }
      if (!valueSet) {
        for (let j = 0; j < pos; j++) {
          if (ipPattern[j] === "_") {
            ipPattern = ipPattern.substring(0, j) + (val === 0 ? "0" : "1") + ipPattern.substring(j + 1);
            break;
          }
        }
      }
    }

    return ipPattern;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  
  async bruteforceIPPattern(pattern) {
    await new Promise(r => setTimeout(r, this.getRandomInt(20) * 1000));
    return "75.75.75.75";
  }

  updateLastBLock(block) {
    this.chain[this.chain.length - 1] = block;
  }

  addBlock(block) {
    delete block["isSpent"];
    this.chain.push(block);
  }

  getAll() {
    return this.chain;
  }
}

module.exports = Blockchain;
