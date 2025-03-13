# `@railgun-reloaded/0zk-adresses`

> A simple module for encoding nd decoding RAILGUN formatted addresses

## Example Usage

```ts
// Using parse()
const originalAddress: RailgunAddressLike =
  "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts";
const parsedAddress: Optional<AddressData> = parse(originalAddress);
console.log("parsedAddress: ", parsedAddress);

// Using stringify()
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
const stringifiedAddress: string = stringify(originalDecodedAddress);
console.log("stringifiedAddress: ", stringifiedAddress);
```

## Install

```sh
npm install  @railgun-reloaded/0zk-addresses
```

## License

[MIT](LICENSE)
