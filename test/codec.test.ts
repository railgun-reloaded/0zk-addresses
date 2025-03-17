import { describe, it } from "node:test";
import { type AddressData, type RailgunAddressLike } from "../src/types";
import expect from "expect";

import { parse, stringify } from "../src/V2/codec";
import { ADDRESS_LENGTH_LIMIT } from "../src/constants";
import { TEST_VECTORS } from "./vectors";

describe("bech32-encode2", () => {
  it("Should encode and decode addresses", () => {
    for (const [
      _,
      { pubkey, chain, version, address },
    ] of TEST_VECTORS.entries()) {
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
