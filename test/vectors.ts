import { ChainType } from "../src/types";

type TestVector = {
  pubkey: Uint8Array;
  chain: { type: number; id: number } | undefined;
  version: 1;
  address: `0zk1${string}`;
};

const TEST_VECTORS_V2: TestVector[] = [
  {
    pubkey: new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1,
    ]),
    chain: { type: ChainType.EVM, id: 1 },
    address:
      "0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz62p5vw",
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ]),
    chain: { type: ChainType.EVM, id: 1 },
    address:
      "0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca",
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: ChainType.EVM, id: 56 },
    address:
      "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkunpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkcsu8tp",
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      0, 0, 1, 191, 213, 104, 28, 4, 121, 190, 154, 142, 248, 221, 139, 170,
      221, 151, 17, 88, 153, 169, 175, 48, 179, 210, 69, 88, 67, 175, 180, 27,
    ]),
    chain: { type: 1, id: 56 },
    address:
      "0zk1qyqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkumpd9kxwatw8qqqqqdl645pcpreh6dga7xa3w4dm9c3tzv6ntesk0fy2kzr476pkwrfm4m",
    version: 1,
  },
  {
    pubkey: new Uint8Array([
      238, 107, 76, 112, 47, 128, 112, 200, 221, 234, 28, 187, 139, 15, 106, 74,
      81, 139, 119, 250, 141, 63, 155, 104, 97, 123, 102, 69, 80, 231, 95, 100,
    ]),
    chain: undefined,
    address:
      "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts",
    version: 1,
  },
];

export { TEST_VECTORS_V2 };
