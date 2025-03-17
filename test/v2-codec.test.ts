import { describe, it } from "node:test";

import expect from "expect";

import { RailgunAddressV2 } from "../src/V2";
import { type AddressData } from "../src/types";
import { TEST_VECTORS_V2 } from "./vectors";
import { ADDRESS_LENGTH_LIMIT } from "../src/constants";

describe("RailgunAddress-V2 Codecs", () => {
  it("Should properly parse and stringify a RAILGUN-V2 Address", () => {
    for (const [
      _,
      { pubkey, chain, version, address },
    ] of TEST_VECTORS_V2.entries()) {
      const expectedResult: AddressData = {
        masterPublicKey: pubkey,
        viewingPublicKey: pubkey,
        chain,
        version,
      };
      const stringifiedAddress = RailgunAddressV2.stringify(expectedResult);
      const parsed = RailgunAddressV2.parse(stringifiedAddress);
      expect(stringifiedAddress).toBe(address);
      expect(stringifiedAddress.length).toBe(ADDRESS_LENGTH_LIMIT);
      expect(parsed).toMatchObject(expectedResult);
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

      RailgunAddressV2.stringify(badKeyLengthData);
    }).toThrowError("Invalid byte length for input.");
  });

  it("Should throw error on invalid address checksum", () => {
    expect(() => {
      RailgunAddressV2.parse(
        "0zk1pnj7u66vwqhcquxgmh4pewutpa4y55vtwlag60umdpshkej92rn47ey76ges3t3enn"
      );
    }).toThrowError("Invalid checksum");
  });

  it("Should throw error on invalid address prefix", () => {
    expect(() => {
      RailgunAddressV2.parse(
        "0zk1rgqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsfhuuw"
      );
    }).toThrowError("Failed to decode bech32 address");
  });
});
