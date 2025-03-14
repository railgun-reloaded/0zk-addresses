import { bech32m } from "@scure/base";
import { ADDRESS_LENGTH_LIMIT, ADDRESS_VERSION, PREFIX } from "./constants";
import {
  // ByteLength,
  type AddressData,
  type Chain,
  type RailgunAddressLike,
} from "./types";
import { networkIDToChain, chainToNetworkID, xorRailgun } from "./chain";
// import { formatUint8ArrayToLength } from "./bytes";

/**
 * @param address - RAILGUN encoded address like string
 * @returns {AddressData}
 */
const parse = (address: RailgunAddressLike): AddressData => {
  if (!address) {
    throw new Error("Error: No address input.");
  }

  try {
    const decoded = bech32m.decode(address, ADDRESS_LENGTH_LIMIT);

    if (decoded.prefix !== PREFIX) {
      throw new Error("Invalid address prefix");
    }

    const data = bech32m.fromWords(decoded.words);

    if (data.byteLength !== 73) {
      throw new Error("Invalid address length");
    }

    // Get version
    const version = data[0]!;
    const masterPublicKey = data.subarray(1, 33);
    const networkID = data.subarray(33, 41);
    const viewingPublicKey = data.subarray(41, 73);

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
  } catch (error) {
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("Invalid checksum")
    ) {
      throw new Error("Invalid checksum");
    }
    throw new Error("Failed to decode bech32 address");
  }
};

/**
 * Bech32 encodes address
 * @param addressData - AddressData to encode
 */
const stringify = ({
  masterPublicKey,
  chain,
  viewingPublicKey,
}: AddressData): RailgunAddressLike => {
  // Create 73 byte address buffer (version || masterPublicKey || networkID || viewingPublicKey)
  const addressBuffer = new Uint8Array(73);
  const networkID = chainToNetworkID(chain);

  const networkIDXor = xorRailgun(networkID);

  addressBuffer[0] = 0x01; // Version "01"

  addressBuffer.set(masterPublicKey, 1);
  addressBuffer.set(networkIDXor, 33);
  addressBuffer.set(viewingPublicKey, 41);

  // Encode address
  const address = bech32m.encode(
    PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  );

  return address;
};

export { parse, stringify };
