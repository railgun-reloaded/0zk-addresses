// @railgun-reloaded/addresses
// .parse(addressStr): Address
// Address format: 0zk1 masterPublicKey networkInfo viewingKey checksum
// .stringify({ masterPublicKey, viewingKey, chainType, chainId }): string

import {
  ADDRESS_LENGTH_LIMIT,
  ADDRESS_VERSION,
  ALL_CHAINS_NETWORK_ID,
  PREFIX,
} from "./constants";
import { bech32m } from "@scure/base";
import {
  ByteLength,
  type AddressData,
  type Chain,
  type RailgunAddressLike,
} from "./types";
import {
  formatToByteLength,
  hexlify,
  hexStringToBytes,
  hexToBigInt,
  nToHex,
  xor,
} from "./bytes";

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

const chainToNetworkID = (chain: Optional<Chain>): string => {
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
const xorNetworkID = (chainID: string) => {
  const chainIDBuffer = Buffer.from(chainID, "hex");
  const railgunBuffer = Buffer.from("railgun", "utf8");

  const xorOutput = xor(chainIDBuffer, railgunBuffer);

  console.log("xorOutput", xorOutput);

  return xorOutput.toString("hex");
};

/**
 * @param address - RAILGUN encoded address like string
 * @returns {AddressData}
 */
const parse = (address: RailgunAddressLike): AddressData | undefined => {
  try {
    if (!address) {
      throw new Error("Error: No address input.");
    }

    const decoded = bech32m.decode(address, ADDRESS_LENGTH_LIMIT);

    if (decoded.prefix !== PREFIX) {
      throw new Error("Invalid address prefix");
    }

    // Hexlify data
    const data = hexlify(bech32m.fromWords(decoded.words));

    console.log("DECODED OBJ", decoded);
    console.log("DATA DECODED", data);

    // Get version
    const version = parseInt(data.slice(0, 2), 16);
    const masterPublicKey = hexToBigInt(data.slice(2, 66));
    const networkID = xorNetworkID(data.slice(66, 82));
    const viewingPublicKey = hexStringToBytes(data.slice(82, 146));

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

    console.log("DECODED RESULT", result);
    return result;
  } catch (error) {
    console.log(error);
  }
  // TODO: throw error here instead of returning undefined.
  return undefined;
};

/**
 * Bech32 encodes address
 * @param addressData - AddressData to encode
 */
const stringify = (addressData: AddressData): string => {
  const masterPublicKey = nToHex(
    addressData.masterPublicKey,
    ByteLength.UINT_256,
    false
  );
  const viewingPublicKey = formatToByteLength(
    addressData.viewingPublicKey,
    ByteLength.UINT_256
  );

  const { chain } = addressData;
  const networkID = xorNetworkID(chainToNetworkID(chain));

  const version = "01";

  const addressString = `${version}${masterPublicKey}${networkID}${viewingPublicKey}`;

  // Create 73 byte address buffer
  const addressBuffer = Buffer.from(addressString, "hex");

  // Encode address
  const address = bech32m.encode(
    PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  );

  return address;
};

export { parse, stringify };
