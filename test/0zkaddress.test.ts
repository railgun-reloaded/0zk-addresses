import { describe, it } from "node:test";
import {
  ChainType,
  type AddressData,
  type RailgunAddressLike,
} from "../src/types";
import expect from "expect";
import { parse, stringify } from "../src";
import { ADDRESS_LENGTH_LIMIT } from "../src/constants";

const testVectors = [
  {
    pubkey: new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]),
    chain: { type: ChainType.EVM, id: 1 },
    address:
      "0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca" as RailgunAddressLike,
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: ChainType.EVM, id: 56 },
    address:
      "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkunpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkcsu8tp" as RailgunAddressLike,
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: 1, id: 56 },
    address:
      "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkumpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkwrfm4m" as RailgunAddressLike,
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: ChainType.ANY, id: 0 },
    address:
      "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476phrtpd9kxwatwqqqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pk6xnyq6" as RailgunAddressLike,
    version: 1,
  },
];

describe("bech32-encode2", () => {
  it("Should encode and decode addresses", () => {
    for (const [_, vector] of testVectors.entries()) {
      const { pubkey, chain, address, version } = vector;

      const addressData: AddressData = {
        masterPublicKey: pubkey,
        viewingPublicKey: pubkey,
        chain,
        version,
      };

      // Encode address using stringify()
      const encodedAddress: RailgunAddressLike = stringify(addressData);
      expect(encodedAddress).toBe(address);
      expect(encodedAddress.length).toBe(ADDRESS_LENGTH_LIMIT);

      // Decode address using parse()
      expect(parse(address)).toMatchObject(addressData);
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
