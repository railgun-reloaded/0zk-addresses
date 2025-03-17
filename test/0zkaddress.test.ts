import { describe, it } from "node:test";
import {
  ChainType,
  type AddressData,
  type RailgunAddressLike,
} from "../src/types";
import expect from "expect";

import { parse, stringify } from "../src";
import { ADDRESS_LENGTH_LIMIT } from "../src/constants";

describe("bech32-encode2", () => {
  it("Should encode and decode addresses", () => {
    const vectors = [
      {
        pubkey: new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
        chain: { type: ChainType.EVM, id: 1 },
        address:
          "0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca",
        version: 1,
      },
      {
        pubkey: new Uint8Array([
          0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
          221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180,
          27,
        ]),
        chain: { type: ChainType.EVM, id: 56 },
        address:
          "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkunpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkcsu8tp",
        version: 1,
      },
      {
        pubkey: new Uint8Array([
          0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
          221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180,
          27,
        ]),
        chain: { type: 1, id: 56 },
        address:
          "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkumpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkwrfm4m",
        version: 1,
      },
      {
        pubkey: new Uint8Array([
          238, 107, 76, 112, 47, 128, 112, 200, 221, 234, 28, 187, 139, 15, 106,
          74, 81, 139, 119, 250, 141, 63, 155, 104, 97, 123, 102, 69, 80, 231,
          95, 100,
        ]),
        chain: undefined,
        address:
          "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts",
        version: 1,
      },
    ];
    for (const [_, { pubkey, chain, version, address }] of vectors.entries()) {
      const addressData: AddressData = {
        masterPublicKey: pubkey,
        viewingPublicKey: pubkey,
        chain,
        version,
      };

      const encodedAddress: RailgunAddressLike = stringify(addressData);

      const parsed = parse(encodedAddress);
      expect(encodedAddress).toBe(address);
      expect(encodedAddress.length).toBe(ADDRESS_LENGTH_LIMIT);
      expect(parsed).toMatchObject(addressData);
    }
  });

  it("Should throw error on invalid input length", () => {
    expect(() => {
      const badKeyLengthData: AddressData = {
        masterPublicKey: new Uint8Array([0, 0, 0, 0]),
        viewingPublicKey: new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
        chain: undefined,
        version: undefined,
      };

      stringify(badKeyLengthData);
    }).toThrowError("Invalid byte length for input.");
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
