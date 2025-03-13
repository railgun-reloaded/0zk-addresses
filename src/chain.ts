import { formatToByteLength, hexlify, xor } from "./bytes";
import { ALL_CHAINS_NETWORK_ID } from "./constants";
import { Chain, ByteLength } from "./types";

/**
 * The function `getChainFullNetworkID` formats a chain's type and ID into a full network ID string.
 * @param {Chain} chain - The `chain` parameter is an object that contains information about a
 * blockchain network. It has two properties:
 * @returns The function `getChainFullNetworkID` returns a string that concatenates the formatted chain
 * type and chain ID of the input `chain` object.
 */
const getChainFullNetworkID = (chain: Chain): string => {
  // 1 byte: chainType.
  const formattedChainType = formatToByteLength(
    hexlify(chain.type),
    ByteLength.UINT_8
  );
  // 7 bytes: chainID.
  const formattedChainID = formatToByteLength(
    hexlify(chain.id),
    ByteLength.UINT_56
  );
  return `${formattedChainType}${formattedChainID}`;
};

/**
 * The function `networkIDToChain` converts a network ID string into a Chain object in TypeScript.
 * @param {string} networkID - The `networkID` parameter is a string representing the ID of a network.
 * @returns The function `networkIDToChain` returns an Optional<Chain> value. If the `networkID`
 * parameter is equal to `ALL_CHAINS_NETWORK_ID`, it returns `undefined`. Otherwise, it constructs a
 * `Chain` object with `type` and `id` properties based on the provided `networkID` and returns that
 * `Chain` object.
 */
export const networkIDToChain = (networkID: string): Optional<Chain> => {
  if (networkID === ALL_CHAINS_NETWORK_ID) {
    return undefined;
  }

  const chain: Chain = {
    type: parseInt(networkID.slice(0, 2), 16),
    id: parseInt(networkID.slice(2, 16), 16),
  };
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
export const chainToNetworkID = (chain: Optional<Chain>): string => {
  if (chain == null) {
    return ALL_CHAINS_NETWORK_ID;
  }

  const networkID = getChainFullNetworkID(chain);
  return networkID;
};

/**
 * @param chainID - hex value of chainID
 * @returns - chainID XOR'd with 'railgun' to make address prettier
 */
export const xorNetworkID = (chainID: string) => {
  const chainIDBuffer = Buffer.from(chainID, "hex");
  const railgunBuffer = Buffer.from("railgun", "utf8");

  const xorOutput = xor(chainIDBuffer, railgunBuffer);

  return xorOutput.toString("hex");
};
