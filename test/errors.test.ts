import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { bech32m } from '@scure/base'

import type { AddressData } from '../src/definitions.js'
import {
  ADDRESS_LENGTH_LIMIT,
  CURRENT_ADDRESS_VERSION,
  ChainType,
  RAILGUN_ADDRESS_PREFIX,
} from '../src/definitions.js'
import { RailgunAddressError } from '../src/errors.js'
import { parse, stringify } from '../src/index.js'

const VALID_ADDRESS =
  '0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca'

const VALID_ADDRESS_DATA: AddressData = {
  masterPublicKey: new Uint8Array(32).fill(0),
  viewingPublicKey: new Uint8Array(32).fill(0),
  chain: { type: ChainType.EVM, id: 1n },
  version: CURRENT_ADDRESS_VERSION,
}

describe('RailgunAddressError — typed failure modes', () => {
  describe('InvalidPrefix', () => {
    it('accepts a valid address (no prefix error)', () => {
      assert.doesNotThrow(() => parse(VALID_ADDRESS))
    })

    it('throws code InvalidPrefix when the 0zk1 prefix is missing', () => {
      assert.throws(
        () => parse('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'InvalidPrefix')
          return true
        }
      )
    })
  })

  describe('InvalidChecksum', () => {
    it('accepts a valid address (no checksum error)', () => {
      assert.doesNotThrow(() => parse(VALID_ADDRESS))
    })

    it('throws code InvalidChecksum on a bech32m checksum failure', () => {
      assert.throws(
        () =>
          parse(
            '0zk1pnj7u66vwqhcquxgmh4pewutpa4y55vtwlag60umdpshkej92rn47ey76ges3t3enn'
          ),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'InvalidChecksum')
          return true
        }
      )
    })
  })

  describe('InvalidLength', () => {
    it('accepts a valid address (no length error)', () => {
      assert.doesNotThrow(() => parse(VALID_ADDRESS))
    })

    it('throws code InvalidLength when the decoded length is out of bounds', () => {
      assert.throws(
        () =>
          parse(
            '0zk1rgqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsfhuuw'
          ),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'InvalidLength')
          return true
        }
      )
    })
  })

  describe('UnsupportedVersion', () => {
    it('accepts a current-version address (no version error)', () => {
      assert.doesNotThrow(() => parse(VALID_ADDRESS))
    })

    it('throws code UnsupportedVersion when parse decodes an unknown version', () => {
      const buffer = new Uint8Array(73)
      buffer[0] = CURRENT_ADDRESS_VERSION + 1
      const unsupportedVersionAddress = bech32m.encode(
        RAILGUN_ADDRESS_PREFIX,
        bech32m.toWords(buffer),
        ADDRESS_LENGTH_LIMIT
      )

      assert.throws(
        () => parse(unsupportedVersionAddress),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'UnsupportedVersion')
          return true
        }
      )
    })

    it('throws code UnsupportedVersion when stringify is given an unknown version', () => {
      assert.throws(
        () => stringify({ ...VALID_ADDRESS_DATA, version: 2 }),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'UnsupportedVersion')
          return true
        }
      )
    })
  })

  describe('InvalidMasterPublicKeyLength', () => {
    it('accepts a valid master public key (no length error)', () => {
      assert.doesNotThrow(() => stringify(VALID_ADDRESS_DATA))
    })

    it('throws code InvalidMasterPublicKeyLength when masterPublicKey is not 32 bytes', () => {
      assert.throws(
        () =>
          stringify({
            ...VALID_ADDRESS_DATA,
            masterPublicKey: new Uint8Array(16).fill(0),
          }),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'InvalidMasterPublicKeyLength')
          return true
        }
      )
    })
  })

  describe('InvalidViewingPublicKeyLength', () => {
    it('accepts a valid viewing public key (no length error)', () => {
      assert.doesNotThrow(() => stringify(VALID_ADDRESS_DATA))
    })

    it('throws code InvalidViewingPublicKeyLength when viewingPublicKey is not 32 bytes', () => {
      assert.throws(
        () =>
          stringify({
            ...VALID_ADDRESS_DATA,
            viewingPublicKey: new Uint8Array(16).fill(0),
          }),
        (error: unknown) => {
          assert.ok(error instanceof RailgunAddressError)
          assert.strictEqual(error.code, 'InvalidViewingPublicKeyLength')
          return true
        }
      )
    })
  })
})
