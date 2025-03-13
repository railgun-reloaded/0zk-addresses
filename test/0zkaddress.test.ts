import { describe, it } from "node:test";
import {
  ByteLength,
  ChainType,
  type AddressData,
  type RailgunAddressLike,
} from "../src/types";
import expect from "expect";
import {
  formatToByteLength,
  hexStringToBytes,
  hexToBigInt,
} from "../src/bytes";
import { parse, stringify } from "../src";
import { ADDRESS_LENGTH_LIMIT } from "../src/constants";

describe("bech32-encode2", () => {
  it("Should encode and decode addresses", () => {
    const vectors = [
      {
        pubkey: "00000000",
        chain: { type: ChainType.EVM, id: 1 },
        address:
          "0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca",
        version: 1,
      },
      {
        pubkey: "01bfd5681c0479be9a8ef8dd8baadd97115899a9af30b3d2455843afb41b",
        chain: { type: ChainType.EVM, id: 56 },
        address:
          "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkunpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkcsu8tp",
        version: 1,
      },
      {
        pubkey: "01bfd5681c0479be9a8ef8dd8baadd97115899a9af30b3d2455843afb41b",
        chain: { type: 1, id: 56 },
        address:
          "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkumpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkwrfm4m",
        version: 1,
      },
      {
        pubkey:
          "ee6b4c702f8070c8ddea1cbb8b0f6a4a518b77fa8d3f9b68617b664550e75f64",
        chain: undefined,
        address:
          "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts",
        version: 1,
      },
    ];
    for (const [_, vector] of vectors.entries()) {
      const addressData: AddressData = {
        masterPublicKey: hexToBigInt(vector.pubkey),
        viewingPublicKey: hexStringToBytes(
          formatToByteLength(vector.pubkey, ByteLength.UINT_256, false)
        ),
        chain: vector.chain,
        version: vector.version,
      };
      const encoded: RailgunAddressLike = stringify(addressData);
      expect(encoded).toBe(vector.address);
      expect(encoded.length).toBe(ADDRESS_LENGTH_LIMIT);
      expect(parse(encoded)).toMatchObject(addressData);
    }
  });

  it("Should throw error on invalid address checksum", () => {
    expect(() => {
      parse(
        "0zk1pnj7u66vwqhcquxgmh4pewutpa4y55vtwlag60umdpshkej92rn47ey76ges3t3enn"
      );
    }).toThrowError("Invalid checksum");
  });

  it("Should throw error on invalid address prefix", () => {
    expect(() => {
      parse(
        "0zk1rgqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsfhuuw"
      );
    }).toThrowError("Failed to decode bech32 address");
  });
});
