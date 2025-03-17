import { bech32m } from "@scure/base";
import { type AddressData, type Chain, type RailgunAddressLike } from "./types";
import { networkIDToChain, chainToNetworkID, xorRailgun } from "./chain";
import {
  ADDRESS_VERSION,
  ADDRESS_LENGTH_LIMIT,
  RAILGUN_ADDRESS_PREFIX,
  CURRENT_ADDRESS_VERSION,
} from "./constants";

/**
 * @param address - The `address` parameter is of type `RailgunAddressLike` and its the encoded RAILGUN  address.
 * @returns {AddressData} - Returns `addressData` object with the data decoded.
 */
const parse = (address: RailgunAddressLike): AddressData => {
  if (!address) {
    throw new Error("Error: No address input.");
  }

  try {
    const decoded = bech32m.decode(address, ADDRESS_LENGTH_LIMIT);

    if (decoded.prefix !== RAILGUN_ADDRESS_PREFIX) {
      throw new Error("Invalid address prefix");
    }

    const data = bech32m.fromWords(decoded.words);

    if (data.byteLength !== 73) {
      throw new Error("Invalid address length");
    }

    // Create variables for AddressData from the decoded data
    const version = data[0]!; // 1 byte
    const masterPublicKey = data.subarray(1, 33); // 32 bytes
    const networkID = data.subarray(33, 41); // 8 bytes
    const viewingPublicKey = data.subarray(41, 73); // 32 bytes

    const chain: Optional<Chain> = networkIDToChain(networkID);

    // Throw if address version is not supported
    if (version !== ADDRESS_VERSION)
      throw new Error("Incorrect address version");

    const result: AddressData = {
      masterPublicKey,
      viewingPublicKey,
      version,
      chain,
    };

    return result;
  } catch (cause) {
    if (
      cause instanceof Error &&
      cause.message &&
      cause.message.includes("Invalid checksum")
    ) {
      throw new Error("Invalid checksum");
    }
    throw new Error("Failed to decode bech32 address", { cause });
  }
};

/**
 * Bech32 encodes address
 * @param addressData - The `addressData` parameter is of type `AddressData` and its the data to be encoded.
 * @returns {RailgunAddressLike} - Returns a string that represents the encoded address.
 */
const stringify = ({
  masterPublicKey,
  chain,
  viewingPublicKey,
}: AddressData): RailgunAddressLike => {
  if (masterPublicKey.byteLength !== 32) {
    throw new Error("Invalid masterPublicKey length, expected 32 bytes");
  }

  // Create 73 byte address buffer (version || masterPublicKey || networkID || viewingPublicKey)
  const addressBuffer = new Uint8Array(73);
  const networkID = chainToNetworkID(chain);
  const networkIDXor = xorRailgun(networkID);

  addressBuffer[0] = CURRENT_ADDRESS_VERSION; // Version "01" 1 byte
  addressBuffer.set(masterPublicKey, 1); // 32 bytes
  addressBuffer.set(networkIDXor, 33); // 8 bytes
  addressBuffer.set(viewingPublicKey, 41); // 32 bytes

  // Encode address
  const address = bech32m.encode(
    RAILGUN_ADDRESS_PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  );

  return address;
};

export { parse, stringify };
