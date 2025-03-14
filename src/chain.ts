import { ALL_CHAINS_NETWORK_ID, RAILGUN_ASCII } from "./constants";
import { Chain } from "./types";

/**
 * The function `getChainFullNetworkID` formats a chain's type and ID into a full network ID string.
 * @param {Chain} chain - The `chain` parameter is an object that contains information about a
 * blockchain network. It has two properties:
 * @returns The function `getChainFullNetworkID` returns a string that concatenates the formatted chain
 * type and chain ID of the input `chain` object.
 */
const getChainFullNetworkID = ({ type, id }: Chain): Uint8Array => {
  const networkBuf = new Uint8Array(8);
  const dataView = new DataView(networkBuf.buffer);

  // 7 bytes: chainID.
  // Set the chain ID as a 7-byte number (56 bits) starting from the 1st byte.
  dataView.setBigUint64(0, BigInt(id), false); // false for big-endian

  // 1 byte: chainType.
  networkBuf[0] = type;

  return networkBuf;
};

/**
 * The function `networkIDToChain` converts a network ID string into a Chain object in TypeScript.
 * @param {string} networkID - The `networkID` parameter is a string representing the ID of a network.
 * @returns The function `networkIDToChain` returns an Optional<Chain> value. If the `networkID`
 * parameter is equal to `ALL_CHAINS_NETWORK_ID`, it returns `undefined`. Otherwise, it constructs a
 * `Chain` object with `type` and `id` properties based on the provided `networkID` and returns that
 * `Chain` object.
 */

export const networkIDToChain = (networkID: Uint8Array): Chain => {
  // We xor the networkID with the RAILGUN_ASCII to decode the chain type and ID.
  const xorNetwork = xorRailgun(networkID);
  const dataViewNetwork = new DataView(xorNetwork.buffer);
  const bigIntDataNetwork = dataViewNetwork.getBigUint64(0, false);

  /**
   * Extracts the chain type and ID from the decoded network identifier.
   * The chain type is determined by the most significant byte (shifted right by 56 bits),
   * and the chain ID is extracted from the remaining 56 bits using a bitwise AND operation.
   */
  const type = Number(bigIntDataNetwork >> 56n);
  const id = Number(bigIntDataNetwork & 0x00ff_ffff_ffff_ffffn);

  const chain: Chain = { type, id };
  return chain;
};

/**
 * The function `chainToNetworkID` takes an optional `Chain` parameter and returns the network ID
 * associated with the chain, or a default value if the chain is null.
 * @param chain - The `chain` parameter is of type `Optional<Chain>`, which means it can either be a
 * `Chain` object or `null`.
 * @returns The function `chainToNetworkID` returns the network ID associated with the input `chain`.
 * If the `chain` is `null`, it returns the network ID for all chains.
 */
export const chainToNetworkID = (chain: Optional<Chain>): Uint8Array => {
  if (chain == null) {
    return ALL_CHAINS_NETWORK_ID;
  }

  const networkID = getChainFullNetworkID(chain);
  return networkID;
};

// TODO: Add documentation
export const xorRailgun = (chainID: Uint8Array) => {
  const xorOutput = new Uint8Array(8);

  for (let i = 0; i < chainID.length; i++) {
    xorOutput[i] = chainID[i]! ^ RAILGUN_ASCII[i]!;
  }

  return xorOutput;
};
