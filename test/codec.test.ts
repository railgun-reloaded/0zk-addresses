import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parse, stringify } from '../src'
import type {
  AddressData,
  RailgunAddressLike
} from '../src/definitions'
import {
  ADDRESS_LENGTH_LIMIT,
  CHAIN_ID_ANY,
  ChainType,
} from '../src/definitions'

const testVectors = [
  {
    pubkey: new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]),
    chain: { type: ChainType.EVM, id: BigInt(1) },
    address:
      '0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca' as RailgunAddressLike,
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: ChainType.EVM, id: BigInt(56) },
    address:
      '0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkunpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkcsu8tp' as RailgunAddressLike,
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      238, 107, 76, 112, 47, 128, 112, 200, 221, 234, 28, 187, 139, 15, 106, 74,
      81, 139, 119, 250, 141, 63, 155, 104, 97, 123, 102, 69, 80, 231, 95, 100,
    ]),
    chain: { type: ChainType.ANY, id: BigInt(CHAIN_ID_ANY) },
    address:
      '0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts' as RailgunAddressLike,
    version: 1,
  },
]

describe('Railgun Addresses Encoding & Decoding', () => {
  it('Should encode and decode addresses', () => {
    for (const [, vector] of testVectors.entries()) {
      const { pubkey, chain, address, version } = vector

      const addressData: AddressData = {
        masterPublicKey: pubkey,
        viewingPublicKey: pubkey,
        chain,
        version,
      }

      // Encode address using stringify()
      const encodedAddress: RailgunAddressLike = stringify(addressData)
      assert.strictEqual(encodedAddress, address)
      assert.strictEqual(encodedAddress.length, ADDRESS_LENGTH_LIMIT)

      // Decode address using parse()
      assert.deepStrictEqual(parse(address), addressData)
    }
  })

  it('Should throw error on invalid address checksum', () => {
    assert.throws(() => {
      parse(
        '0zk1pnj7u66vwqhcquxgmh4pewutpa4y55vtwlag60umdpshkej92rn47ey76ges3t3enn'
      )
    }, /Invalid checksum/)
  })

  it('Should throw error on invalid address length', () => {
    assert.throws(() => {
      parse(
        '0zk1rgqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsfhuuw'
      )
    }, /invalid string length/)
  })

  it('Should throw error on invalid viewingPublicKey length', () => {
    const viewingPublicKey = new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
    ])
    const masterPublicKey = new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ])

    const addressData: AddressData = {
      masterPublicKey,
      viewingPublicKey,
      chain: { type: ChainType.EVM, id: BigInt(1) },
      version: 1,
    }

    assert.throws(() => {
      stringify(addressData)
    }, /Invalid viewingPublicKey length, expected 32 bytes/)
  })

  it('Should throw error on invalid masterPublicKey length', () => {
    const masterPublicKey = new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
    ])
    const viewingPublicKey = new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ])

    const addressData: AddressData = {
      masterPublicKey,
      viewingPublicKey,
      chain: { type: ChainType.EVM, id: BigInt(1) },
      version: 1,
    }

    assert.throws(() => {
      stringify(addressData)
    }, /Invalid masterPublicKey length, expected 32 bytes/)
  })

  it('Should encode address data with chain info undefined and return chain info for any', () => {
    const encodedAddress: RailgunAddressLike =
      '0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476phrv7j6fe3z53luqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pk26ds9v'
    const originalAddressData: AddressData = {
      masterPublicKey: new Uint8Array([
        0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
        221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
      ]),
      viewingPublicKey: new Uint8Array([
        0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
        221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
      ]),
      version: 1,
      chain: undefined,
    }
    const expectedDecodedAddressData: AddressData = {
      masterPublicKey: new Uint8Array([
        0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
        221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
      ]),
      viewingPublicKey: new Uint8Array([
        0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
        221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
      ]),
      version: 1,
      chain: { type: ChainType.ANY, id: CHAIN_ID_ANY },
    }

    assert.strictEqual(encodedAddress, stringify(originalAddressData))
    assert.deepStrictEqual(parse(encodedAddress), expectedDecodedAddressData)
  })
})
