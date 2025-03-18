# `@railgun-reloaded/0zk-addresses`

> A simple module for encoding and decoding RAILGUN formatted addresses

## Install

```sh
npm install  @railgun-reloaded/0zk-addresses
```

## Example Usage

### `parsing`

```ts
import { parse } from "@railgun-reloaded/0zk-addresses";

function main() {
  const recipientRailgunAddress =
    "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts";
  const addressData = parse(recipientRailgunAddress);

  console.log("recipientRailgunAddress", recipientRailgunAddress);
  console.log("addressData", addressData);
}

main();
```

#### Output

```sh
      recipientRailgunAddress 0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts
      addressData {
        version: 1,
        masterPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        viewingPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        chain: { type: 255, id: 72057594037927935n }
      }
```

### `stringify`
```ts
import { stringify, CHAIN_ID_ANY, type ChainType,} from "@railgun-reloaded/0zk-addresses";

function main() {
  const railgunAddressData = {
        masterPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        viewingPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        chain: { type: ChainType.ALL, id: CHAIN_ID_ANY },
        version: 1
  };
  const stringifiedAddress = stringify(railgunAddressData);

  console.log("stringifiedAddress", stringifiedAddress);
  console.log("addressData", addressData);
}

main();
```

#### Output

```sh
      stringifiedAddress 0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts
      addressData {
        version: 1,
        masterPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        viewingPublicKey: Uint8Array(32) [
          238, 107,  76, 112,  47, 128, 112, 200,
          221, 234,  28, 187, 139,  15, 106,  74,
          81, 139, 119, 250, 141,  63, 155, 104,
          97, 123, 102,  69,  80, 231,  95, 100
        ],
        chain: { type: 255, id: 72057594037927935n }
      }
```
## Deep Understanding

### How is a RAILGUN Address composed?

- RAILGUN addresses are 73 bytes concatenated

```ts
// Pseudocode example composition, not proper byte construction.
addressBytes =
  versionByte + masterPublicKeyBytes + networkInfoBytes + viewingPublicKeyBytes;

addressStruct = {
  version, // number - Address scheme version (1 byte)
  masterPublicKey, // Uint8Array - Produced from deriving keys from your mnemonic (32 bytes)
  chain, // { type: number, id: bigint } - (8 bytes; type = 1 byte; id = 7 bytes)
  viewingPublicKey, // Uint8Array - Produced from deriving keys from your mnemonic (32 bytes)
};
```

### How is a RAILGUN Address Encoded?

- RAILGUN addresses are encoded using `bech32m.encode()` with the `0zk` prefix and a fixed length of 127.

```ts
bech32m.encode(
  RAILGUN_ADDRESS_PREFIX, // "0zk"
  bech32m.toWords(addressBuffer), // Properly composed address byte array
  ADDRESS_LENGTH_LIMIT // 127
);
```

## License

[MIT](LICENSE)
