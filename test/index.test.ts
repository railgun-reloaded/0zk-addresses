import { describe, it } from "node:test";
import assert from "node:assert";
import { parse, stringify } from "../src";
import { AddressData, isDefined, type RailgunAddressLike } from "../src/types";

const LOG_SEPARATOR = "----------------------------------------";
const originalAddress: RailgunAddressLike =
  "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts";
const originalDecodedAddress: AddressData = {
  masterPublicKey:
    107840038155987585452015163184318756879563730268045790440630167370538141835108n,
  viewingPublicKey: new Uint8Array([
    238, 107, 76, 112, 47, 128, 112, 200, 221, 234, 28, 187, 139, 15, 106, 74,
    81, 139, 119, 250, 141, 63, 155, 104, 97, 123, 102, 69, 80, 231, 95, 100,
  ]),
  version: 1,
  chain: undefined,
};

describe.only("Full test suit", () => {
  it("should parse and stringify an address", { only: true }, () => {
    const parsedAddress: Optional<AddressData> = parse(originalAddress);

    if (isDefined(parsedAddress)) {
      const stringifiedAddress = stringify(parsedAddress);

      console.log(LOG_SEPARATOR);
      console.log("Stringified Address:\n", stringifiedAddress);
      console.log("Original Address:\n", originalAddress);
      console.log(LOG_SEPARATOR);
      console.log("Original Decoded Address:\n", originalDecodedAddress);
      console.log("Parsed Address:\n", parsedAddress);
      console.log(LOG_SEPARATOR);

      assert(originalAddress === stringifiedAddress, "ADDRESS MATCH");
    }
  });

  it("should stringify an address", { only: true }, () => {
    const stringifiedAddress = stringify(originalDecodedAddress);

    assert(originalAddress === stringifiedAddress, "ADDRESS MATCH");
  });

  it("should parse and address", { only: true }, () => {
    const parsedAddress = parse(originalAddress);

    if (isDefined(parsedAddress)) {
      // TODO: Check if the method use to check if both objects are equal
      assert(deepEqual(parsedAddress, originalDecodedAddress), "ADDRESS MATCH");
    }
  });
});

// TODO: Move this
// Utils
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true; // Same reference
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  )
    return false; // Primitive values or null

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Different number of keys

  return keys1.every((key) => deepEqual(obj1[key], obj2[key])); // Recursively compare values
};
