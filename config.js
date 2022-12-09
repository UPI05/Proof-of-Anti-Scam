// Genesis
const GENESIS_HASH = "0xDEADBEEF";
const GENESIS_TIMESTAMP = "010101010101";
const GENESIS_PROPOSER = "Hieu Vo";
const GENESIS_SIGNATURE = "VH";
const GENESIS_OTHERS = {};

// Message type
const MSG_TYPE = {
  genesisBlock: "Genesis",
  transaction: "Transaction",
  prepareReqMsg: "Prepare request message",
  blockWithIPReq: "Block with IP request",
  localBlockCommit: "Local block commit message",
  blockCommit: "Block commit message"
};

//

const NUM_OF_KNOWN_BIT = 5;
const NUM_OF_TXS_IN_A_BLOCK = 5;
const BLOCK_TIMEOUT = 600; // second
const PREPARE_MSG_TIMEOUT = 5;

//
const DEBUG = false;

module.exports = {
  GENESIS_TIMESTAMP,
  GENESIS_OTHERS,
  GENESIS_PROPOSER,
  GENESIS_SIGNATURE,
  GENESIS_HASH,
  MSG_TYPE,
  BLOCK_TIMEOUT,
  PREPARE_MSG_TIMEOUT,
  DEBUG,
  NUM_OF_KNOWN_BIT,
  NUM_OF_TXS_IN_A_BLOCK
};
