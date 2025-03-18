import assert from "node:assert/strict";
import {
  RAILGUN_ADDRESS_PREFIX,
  ALL_CHAINS_NETWORK_ID,
  RailgunAddressLike,
  CHAIN_ID_MASK,
  RAILGUN_ASCII,
  Chain,
} from "./definitions";

/**
 * The `xorRailgun` function takes a 8 byte Uint8Array called `networkID` and performs XOR operation with a predefined
 * RAILGUN_ASCII array to produce an output Uint8Array.
 * @param {Uint8Array} networkID - Is a `Uint8Array` of 8 bytes that represents the network information containing type and id.
 * @returns Returns an 8-byte Uint8Array that is the result of
 * performing a bitwise XOR operation between each byte of the `networkID` Uint8Array and the
 * corresponding byte of the `RAILGUN_ASCII` array.
 */
export function xorRailgun(networkID: Uint8Array) {
  const xorOutput = new Uint8Array(8);

  for (let i = 0; i < networkID.length; i++) {
    xorOutput[i] = networkID[i]! ^ RAILGUN_ASCII[i]!;
  }

  return xorOutput;
}

/**
 * The function `getChainFullNetworkID` generates a Uint8Array representing the full network ID based
 * on the provided Chain object's type and ID.
 * @param {Chain}  - The `getChainFullNetworkID` function takes a `Chain` object as a parameter, which
 * has two properties: `type` and `id`.
 * @returns Returns a Uint8Array containing the full network ID
 * for a given Chain object. The network ID consists 1 byte representing the chain type and
 * 7 bytes representing the chain ID.
 */
export function getChainFullNetworkID({ type, id }: Chain): Uint8Array {
  const networkBuf = new Uint8Array(8);
  const dataView = new DataView(networkBuf.buffer);

  // 7 bytes: chain id.
  // Set the chain id as a 7-byte number (56 bits) starting from the 1st byte.
  dataView.setBigUint64(0, id, false); // false for big-endian

  // 1 byte: chain type.
  networkBuf[0] = type;

  return networkBuf;
}

/**
 * The function `networkIDToChain` decodes the an encoded networkID.
 * @param {Uint8Array} networkID - It takes a `Uint8Array` parameter named
 * `networkID`, which represents the encoded network identifier used to determine the chain type and ID.
 * @returns Returns a `Chain` object, which contains the `type` and `id` extracted from the decoded network identifier.
 * The `type` is determined by the most significant byte of the decoded network identifier,
 * and the `id` is extracted from the remaining bits using a bitwise AND operation.
 */
export function networkIDToChain(networkID: Uint8Array): Chain {
  // We xor the networkID with the RAILGUN_ASCII to decode the chain type and ID.
  const xorNetwork = xorRailgun(networkID);
  const dataViewNetwork = new DataView(xorNetwork.buffer);
  const bigIntDataNetwork = dataViewNetwork.getBigUint64(0, false);

  /**
   * The chain type is determined by the most significant byte (shifted right by 56 bits),
   * and the chain ID is extracted from the remaining 56 bits using a bitwise AND operation.
   */
  return {
    type: Number(bigIntDataNetwork >> 56n),
    id: bigIntDataNetwork & CHAIN_ID_MASK,
  };
}

/**
 * The function `chainToNetworkID` takes a chain parameter and returns the network ID associated with
 * it, or a default network ID if the chain is null.
 * @param chain - The `chain` parameter is an optional value that represents network information.
 * @returns Returns a `Uint8Array` value, which is either the encoded networkID of the provided `chain` or a default value `ALL_CHAINS_NETWORK_ID` if the `chain` is `null`.
 */
export function chainToNetworkID(chain: Optional<Chain>): Uint8Array {
  if (chain == null) {
    return ALL_CHAINS_NETWORK_ID;
  }

  return getChainFullNetworkID(chain);
}

/**
 * The function `is0zk` in TypeScript asserts that a given string starts with a specific prefix
 * indicating it is a Railgun address.
 * @param {string} str - The `is0zk` function takes a string parameter `str` and asserts that it is of
 * type `RailgunAddressLike`. The function checks if the string starts with the concatenation of
 * `RAILGUN_ADDRESS_PREFIX` and "1". If the condition is not met, it throws
 */
export function is0zk(str: string): asserts str is RailgunAddressLike {
  assert(
    str.startsWith(RAILGUN_ADDRESS_PREFIX + "1"),
    "Provided address must be 0zk1"
  );
}
