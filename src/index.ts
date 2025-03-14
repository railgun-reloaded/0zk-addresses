import { bech32m } from "@scure/base";
import { ADDRESS_LENGTH_LIMIT, ADDRESS_VERSION, PREFIX } from "./constants";
import {
  ByteLength,
  type AddressData,
  type Chain,
  type RailgunAddressLike,
} from "./types";
import { networkIDToChain, chainToNetworkID, xorRailgun } from "./chain";
import { formatUint8ArrayToLength } from "./bytes";

/**
 * @param address - RAILGUN encoded address like string
 * @returns {AddressData}
 */
const parse = (address: RailgunAddressLike): AddressData => {
  if (!address) {
    throw new Error("Error: No address input.");
  }

  try {
    console.log("DECODING ADDRESS", address);
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
    const masterPublicKey = data.subarray(1, 65); // TEST THIS LATER
    const networkID = data.subarray(65, 81); // TEST THIS LATER
    const viewingPublicKey = data.subarray(81, 145); // TEST THIS LATER

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

  // masterPublicKey & viewingPublicKey need to be ByteLength.UINT256

  // const masterPublicKeyPadded = formatToByteLength(
  //   masterPublicKey,
  //   ByteLength.UINT_256
  // );

  const masterPublicKeyBuffer = formatUint8ArrayToLength(
    masterPublicKey,
    ByteLength.UINT_256
  );

  // masterPublicKeyBuffer.set(
  //   masterPublicKey,
  //   ByteLength.UINT_256 - masterPublicKey.length
  // );

  // console.log(masterPublicKey, masterPublicKeyPadded, masterPublicKeyBuffer);

  // const viewingPublicKeyPadded = formatToByteLength(
  //   viewingPublicKey,
  //   ByteLength.UINT_256
  // );
  const viewingPublicKeyBuffer = formatUint8ArrayToLength(
    viewingPublicKey,
    ByteLength.UINT_256
  );

  // console.log(viewingPublicKey, viewingPublicKeyPadded, viewingPublicKeyBuffer);

  const networkIDXor = xorRailgun(networkID);

  // console.log(networkIDXor);

  // console.log("NETWORKID", networkID);
  addressBuffer[0] = 0x01; // Version "01"
  addressBuffer.set(masterPublicKeyBuffer, 1);
  addressBuffer.set(networkIDXor, 33);
  addressBuffer.set(viewingPublicKeyBuffer, 41);

  console.log("addressBuffer", addressBuffer);

  // Encode address
  const address = bech32m.encode(
    PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  );

  return address;
};

export { parse, stringify };
