import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  chainToNetworkID,
  getChainFullNetworkID,
  is0zk,
  networkIDToChain,
  xorRailgun,
} from '../src/chain'
import type { Chain } from '../src/definitions'
import {
  ALL_CHAINS_NETWORK_ID,
  CHAIN_ID_ANY,
  CHAIN_ID_MASK,
  ChainType,
  RAILGUN_ASCII,
} from '../src/definitions'

describe('Chain Utilities', () => {
  describe('xorRailgun', () => {
    it('Should XOR network ID with RAILGUN_ASCII', () => {
      const networkID = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1])
      const result = xorRailgun(networkID)

      // Expected: networkID[i] XOR RAILGUN_ASCII[i]
      const expected = new Uint8Array(8)
      for (let i = 0; i < 8; i++) {
        expected[i] = networkID[i]! ^ RAILGUN_ASCII[i]!
      }

      assert.deepStrictEqual(result, expected)
    })

    it('Should be reversible (XOR twice returns original)', () => {
      const original = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 56])
      const xorOnce = xorRailgun(original)
      const xorTwice = xorRailgun(xorOnce)

      assert.deepStrictEqual(xorTwice, original)
    })

    it('Should handle all zeros', () => {
      const allZeros = new Uint8Array(8).fill(0)
      const result = xorRailgun(allZeros)

      // XOR with zero should return RAILGUN_ASCII
      assert.deepStrictEqual(result, RAILGUN_ASCII)
    })

    it('Should handle all 0xFF', () => {
      const allOnes = new Uint8Array(8).fill(0xff)
      const result = xorRailgun(allOnes)

      const expected = new Uint8Array(8)
      for (let i = 0; i < 8; i++) {
        expected[i] = 0xff ^ RAILGUN_ASCII[i]!
      }

      assert.deepStrictEqual(result, expected)
    })
  })

  describe('getChainFullNetworkID', () => {
    it('Should encode EVM chain ID 1 correctly', () => {
      const chain: Chain = { type: ChainType.EVM, id: 1n }
      const networkID = getChainFullNetworkID(chain)

      assert.strictEqual(networkID.length, 8)
      assert.strictEqual(networkID[0], ChainType.EVM)

      // Verify the ID is stored in the lower 7 bytes
      const dataView = new DataView(networkID.buffer)
      const fullValue = dataView.getBigUint64(0, false)
      assert.strictEqual(fullValue & CHAIN_ID_MASK, 1n)
    })

    it('Should encode EVM chain ID 56 (Binance) correctly', () => {
      const chain: Chain = { type: ChainType.EVM, id: 56n }
      const networkID = getChainFullNetworkID(chain)

      assert.strictEqual(networkID[0], ChainType.EVM)

      const dataView = new DataView(networkID.buffer)
      const fullValue = dataView.getBigUint64(0, false)
      assert.strictEqual(fullValue & CHAIN_ID_MASK, 56n)
    })

    it('Should encode ANY chain type correctly', () => {
      const chain: Chain = { type: ChainType.ANY, id: CHAIN_ID_ANY }
      const networkID = getChainFullNetworkID(chain)

      assert.strictEqual(networkID[0], ChainType.ANY)

      const dataView = new DataView(networkID.buffer)
      const fullValue = dataView.getBigUint64(0, false)
      assert.strictEqual(fullValue & CHAIN_ID_MASK, CHAIN_ID_ANY)
    })

    it('Should encode maximum valid chain ID', () => {
      const maxChainID = CHAIN_ID_MASK // 0x00FFFFFFFFFFFFFF
      const chain: Chain = { type: ChainType.EVM, id: maxChainID }
      const networkID = getChainFullNetworkID(chain)

      assert.strictEqual(networkID[0], ChainType.EVM)

      const dataView = new DataView(networkID.buffer)
      const fullValue = dataView.getBigUint64(0, false)
      assert.strictEqual(fullValue & CHAIN_ID_MASK, maxChainID)
    })

    it('Should encode zero chain ID', () => {
      const chain: Chain = { type: ChainType.EVM, id: 0n }
      const networkID = getChainFullNetworkID(chain)

      assert.strictEqual(networkID[0], ChainType.EVM)

      const dataView = new DataView(networkID.buffer)
      const fullValue = dataView.getBigUint64(0, false)
      assert.strictEqual(fullValue & CHAIN_ID_MASK, 0n)
    })

    it('Should encode common EVM chain IDs', () => {
      const chains = [
        { name: 'Ethereum', type: ChainType.EVM, id: 1n },
        { name: 'Polygon', type: ChainType.EVM, id: 137n },
        { name: 'Arbitrum', type: ChainType.EVM, id: 42161n },
        { name: 'Optimism', type: ChainType.EVM, id: 10n },
        { name: 'Base', type: ChainType.EVM, id: 8453n },
      ]

      for (const { name, type, id } of chains) {
        const networkID = getChainFullNetworkID({ type, id })
        assert.strictEqual(networkID[0], type, `Failed for ${name}`)

        const dataView = new DataView(networkID.buffer)
        const fullValue = dataView.getBigUint64(0, false)
        assert.strictEqual(fullValue & CHAIN_ID_MASK, id, `Failed for ${name}`)
      }
    })
  })

  describe('networkIDToChain', () => {
    it('Should decode EVM chain ID 1 correctly', () => {
      const encoded = new Uint8Array(8)
      encoded[0] = ChainType.EVM
      const dataView = new DataView(encoded.buffer)
      dataView.setBigUint64(0, 1n, false)
      encoded[0] = ChainType.EVM // Reset type byte after setBigUint64

      const xorEncoded = xorRailgun(encoded)
      const decoded = networkIDToChain(xorEncoded)

      assert.strictEqual(decoded.type, ChainType.EVM)
      assert.strictEqual(decoded.id, 1n)
    })

    it('Should decode ANY chain type correctly', () => {
      const encoded = new Uint8Array(8)
      const dataView = new DataView(encoded.buffer)
      dataView.setBigUint64(0, CHAIN_ID_ANY, false)
      encoded[0] = ChainType.ANY

      const xorEncoded = xorRailgun(encoded)
      const decoded = networkIDToChain(xorEncoded)

      assert.strictEqual(decoded.type, ChainType.ANY)
      assert.strictEqual(decoded.id, CHAIN_ID_ANY)
    })

    it('Should round-trip encode/decode chain data', () => {
      const testChains: Chain[] = [
        { type: ChainType.EVM, id: 1n },
        { type: ChainType.EVM, id: 56n },
        { type: ChainType.EVM, id: 137n },
        { type: ChainType.EVM, id: 42161n },
        { type: ChainType.ANY, id: CHAIN_ID_ANY },
        { type: ChainType.EVM, id: 0n },
        { type: ChainType.EVM, id: CHAIN_ID_MASK },
      ]

      for (const original of testChains) {
        const networkID = getChainFullNetworkID(original)
        const xorEncoded = xorRailgun(networkID)
        const decoded = networkIDToChain(xorEncoded)

        assert.strictEqual(decoded.type, original.type)
        assert.strictEqual(decoded.id, original.id)
      }
    })
  })

  describe('chainToNetworkID', () => {
    it('Should return ALL_CHAINS_NETWORK_ID when chain is undefined', () => {
      const result = chainToNetworkID(undefined)
      assert.deepStrictEqual(result, ALL_CHAINS_NETWORK_ID)
    })

    it('Should return encoded network ID for valid chain', () => {
      const chain: Chain = { type: ChainType.EVM, id: 1n }
      const result = chainToNetworkID(chain)

      assert.strictEqual(result.length, 8)
      assert.strictEqual(result[0], ChainType.EVM)
    })

    it('Should return ALL_CHAINS_NETWORK_ID when chain is null', () => {
      const result = chainToNetworkID(undefined)
      assert.deepStrictEqual(result, ALL_CHAINS_NETWORK_ID)
    })
  })

  describe('is0zk', () => {
    it('Should accept valid RAILGUN address prefix', () => {
      const validAddress = '0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca'
      assert.doesNotThrow(() => {
        is0zk(validAddress)
      })
    })

    it('Should throw on missing "1" after prefix', () => {
      assert.throws(() => {
        is0zk('0zk2qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd')
      }, /must be 0zk1/)
    })

    it('Should throw on wrong prefix - "0xk1"', () => {
      assert.throws(() => {
        is0zk('0xk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd')
      }, /must be 0zk1/)
    })

    it('Should throw on wrong prefix - "zk1"', () => {
      assert.throws(() => {
        is0zk('zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd')
      }, /must be 0zk1/)
    })

    it('Should throw on wrong prefix - "0zk"', () => {
      assert.throws(() => {
        is0zk('0zkqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd')
      }, /must be 0zk1/)
    })

    it('Should throw on completely wrong prefix', () => {
      assert.throws(() => {
        is0zk('abc1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd')
      }, /must be 0zk1/)
    })

    it('Should throw on empty string', () => {
      assert.throws(() => {
        is0zk('')
      }, /must be 0zk1/)
    })

    it('Should throw on just "0zk"', () => {
      assert.throws(() => {
        is0zk('0zk')
      }, /must be 0zk1/)
    })
  })
})
