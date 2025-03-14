// This is the ASCII representation of the string "railgun\0"
const RAILGUN_ASCII = new Uint8Array([114, 97, 105, 108, 103, 117, 110, 0]);
const ADDRESS_VERSION = 1;
const ADDRESS_LENGTH_LIMIT = 127;
const ALL_CHAINS_NETWORK_ID = new Uint8Array(8).fill(0xff);
const CURRENT_ADDRESS_VERSION = 0x01;
const PREFIX = "0zk";

export {
  ADDRESS_LENGTH_LIMIT,
  ALL_CHAINS_NETWORK_ID,
  CURRENT_ADDRESS_VERSION,
  PREFIX,
  ADDRESS_VERSION,
  RAILGUN_ASCII,
};
