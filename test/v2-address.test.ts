import { describe, it } from "node:test";

import expect from "expect";

import { RailgunAddressV2 } from "../src/V2";
import { type AddressData } from "../src/types";
import { TEST_VECTORS } from "./vectors";

describe("RailgunAddress-V2", () => {
  it("Should properly parse a RailgunV2 Address", () => {
    for (const [
      _,
      { pubkey, chain, version, address },
    ] of TEST_VECTORS.entries()) {
      const parsed = RailgunAddressV2.parse(address);
      const expectedResult: AddressData = {
        masterPublicKey: pubkey,
        viewingPublicKey: pubkey,
        chain,
        version,
      };
      const stringified = RailgunAddressV2.stringify(expectedResult);
      expect(stringified).toBe(address);
      expect(parsed).toMatchObject(expectedResult);
    }
  });
});
