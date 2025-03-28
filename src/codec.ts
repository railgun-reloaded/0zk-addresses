import { bech32m } from "@scure/base";
import { networkIDToChain, chainToNetworkID, xorRailgun, is0zk } from "./chain";
import {
  CURRENT_ADDRESS_VERSION,
  RAILGUN_ADDRESS_PREFIX,
  ADDRESS_LENGTH_LIMIT,
  RailgunAddressLike,
  type AddressData,
  CHAIN_ID_ANY,
  ChainType,
} from "./definitions";

/**
 * The `parse` function decodes the encoded RAILGUN address using Bech32 and returns the decoded data.
 * @param address - The `address` parameter is of type `RailgunAddressLike` and its the encoded RAILGUN address.
 * @returns {AddressData} - Returns `addressData` object with the data decoded.
 */
export function parse(address: string): AddressData {
  // Check if the address is a RAILGUN address
  is0zk(address);

  // bench32m.decode will throw an error if the address is invalid
  const decodedData = bech32m.fromWords(
    bech32m.decode<typeof RAILGUN_ADDRESS_PREFIX>(address, ADDRESS_LENGTH_LIMIT)
      .words
  );

  // Return decoded address
  return {
    version: decodedData[0]!, // 1 byte
    masterPublicKey: decodedData.subarray(1, 33), // 32 bytes
    viewingPublicKey: decodedData.subarray(41, 73), // 32 bytes
    chain: networkIDToChain(decodedData.subarray(33, 41)), // 8 bytes
  };
}

/**
 * The `stringify` function encodes the address data using Bech32 and returns the encoded address.
 * @param addressData - The `addressData` parameter is of type `AddressData` and its the data to be encoded.
 * @returns {RailgunAddressLike} - Returns a string that represents the encoded address.
 */
export function stringify({
  masterPublicKey,
  viewingPublicKey,
  chain = { type: ChainType.ANY, id: CHAIN_ID_ANY },
  version = CURRENT_ADDRESS_VERSION,
}: AddressData): RailgunAddressLike {
  if (masterPublicKey.length != 32) {
    throw new Error("Invalid masterPublicKey length, expected 32 bytes");
  }
  if (viewingPublicKey.length != 32) {
    throw new Error("Invalid viewingPublicKey length, expected 32 bytes");
  }

  // Create 73 byte address buffer (version || masterPublicKey || networkID || viewingPublicKey)
  const addressBuffer = new Uint8Array(73);
  const networkID = chainToNetworkID(chain);
  const networkIDXor = xorRailgun(networkID);

  addressBuffer[0] = version; // Version "01" 1 byte
  addressBuffer.set(masterPublicKey, 1); // 32 bytes
  addressBuffer.set(networkIDXor, 33); // 8 bytes (id: 7 bytes | type: 1 byte)
  addressBuffer.set(viewingPublicKey, 41); // 32 bytes

  // Return encode address
  return bech32m.encode(
    RAILGUN_ADDRESS_PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  );
}
