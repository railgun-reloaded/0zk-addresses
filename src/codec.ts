import { bech32m } from '@scure/base'

import { chainToNetworkID, is0zk, networkIDToChain, xorRailgun } from './chain'
import type { AddressData, RailgunAddressLike } from './definitions'
import {
  ADDRESS_LENGTH_LIMIT,
  CHAIN_ID_ANY,
  CURRENT_ADDRESS_VERSION,
  ChainType,
  RAILGUN_ADDRESS_PREFIX,
} from './definitions'

/**
 * The `parse` function decodes the encoded RAILGUN address using Bech32 and returns the decoded data.
 * @param address - The `address` parameter is of type `RailgunAddressLike` and its the encoded RAILGUN address.
 * @returns - Returns `addressData` object with the data decoded.
 */
function parse (address: string): AddressData {
  // Check if the address is a RAILGUN address
  is0zk(address)

  // bench32m.decode will throw an error if the address is invalid
  const decodedData = bech32m.fromWords(
    bech32m.decode<typeof RAILGUN_ADDRESS_PREFIX>(address, ADDRESS_LENGTH_LIMIT)
      .words
  )

  // Return decoded address
  return {
    version: decodedData[0]!, // 1 byte
    masterPublicKey: decodedData.subarray(1, 33), // 32 bytes
    viewingPublicKey: decodedData.subarray(41, 73), // 32 bytes
    chain: networkIDToChain(decodedData.subarray(33, 41)), // 8 bytes
  }
}

/**
 * The `stringify` function encodes the address data using Bech32 and returns the encoded address.
 * @param addressData - The `addressData` parameter is of type `AddressData` and its the data to be encoded.
 * @param addressData.masterPublicKey - The master public key (32 bytes) of the address.
 * @param addressData.viewingPublicKey - The viewing public key (32 bytes) of the address.
 * @param addressData.chain - The chain information for the address.
 * @param addressData.version - The version of the address format.
 * @returns - Returns a string that represents the encoded address.
 */
function stringify ({
  masterPublicKey,
  viewingPublicKey,
  chain = { type: ChainType.ANY, id: CHAIN_ID_ANY },
  version = CURRENT_ADDRESS_VERSION,
}: AddressData): RailgunAddressLike {
  if (masterPublicKey.length !== 32) {
    throw new Error('Invalid masterPublicKey length, expected 32 bytes')
  }
  if (viewingPublicKey.length !== 32) {
    throw new Error('Invalid viewingPublicKey length, expected 32 bytes')
  }

  // Create 73 byte address buffer (version || masterPublicKey || networkID || viewingPublicKey)
  const addressBuffer = new Uint8Array(73)
  const networkID = chainToNetworkID(chain)
  const networkIDXor = xorRailgun(networkID)

  addressBuffer[0] = version // Version "01" 1 byte
  addressBuffer.set(masterPublicKey, 1) // 32 bytes
  addressBuffer.set(networkIDXor, 33) // 8 bytes (id: 7 bytes | type: 1 byte)
  addressBuffer.set(viewingPublicKey, 41) // 32 bytes

  // Return encode address
  return bech32m.encode(
    RAILGUN_ADDRESS_PREFIX,
    bech32m.toWords(addressBuffer),
    ADDRESS_LENGTH_LIMIT
  )
}

export { parse, stringify }
