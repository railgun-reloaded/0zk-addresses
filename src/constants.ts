const ADDRESS_VERSION = 1;
const ADDRESS_LENGTH_LIMIT = 127;
const ALL_CHAINS_NETWORK_ID = new Uint8Array(8).fill(0xff);
const PREFIX = "0zk";
// This is the ASCII representation of the string "railgun\0"
const RAILGUN_ASCII = new Uint8Array([114, 97, 105, 108, 103, 117, 110, 0]);

export {
  ADDRESS_LENGTH_LIMIT,
  ALL_CHAINS_NETWORK_ID,
  PREFIX,
  ADDRESS_VERSION,
  RAILGUN_ASCII,
};
