import { describe, it } from "node:test";

import { parse, stringify } from "../src";
import { isDefined, type RailgunAddressLike } from "../src/types";

const address_vectors: RailgunAddressLike[] = [
  "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts",
];

describe.only("bech32m decode input address", () => {
  // The 'only' option is set, so this test is run.
  it("this test is run", { only: true }, () => {
    // This code is run.

    for (const address of address_vectors) {
      const result = parse(address);

      if (isDefined(result)) {
        const stringAddress = stringify(result);
        console.log("RE-Generated:\n", stringAddress);
        console.log("INPUT:\n", address);

        // assert(address === stringAddress, "ADDRESS NOT MATCHETH");
      }

      // test reworking address object back into address.
    }
    it("should decode an encoded address", { todo: true }, () => {});
    it("should encode an decoded address", { todo: true }, () => {});
    it("should encode and decode an address", { todo: true }, () => {});
  });
});
