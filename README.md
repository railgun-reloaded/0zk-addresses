# `@railgun-reloaded/0zk-addresses`

> A simple module for encoding nd decoding RAILGUN formatted addresses

## What is an RAILGUN Address?
 ```ts
  const addressStruct = {
    masterPublicKey,  // (32 bytes) Uint8Array produced from deriving keys from your mnemonic
    viewingPublicKey, // (32 bytes) Uint8Array produced from deriving keys from your mnemonic
    chain,            // (8 bytes) {type: number, id: bigint}
    version           // (1 byte) Address scheme version 
  }
 ```
## How is a RAILGUN Address composed?
```ts 
  // 73 bytes concatenated
  // (pseudocode example composotion, not proper byte construction.)
  addressBytes = versionBytes + masterPublicKeyBytes + networkInfoBytes + viewingPublicKeyBytes;
  

```
## How is a RAILGUN Address Encoded? 
```ts
  bech32m.encode(
      RAILGUN_ADDRESS_PREFIX,         // 0zk
      bech32m.toWords(addressBuffer), // properly composed address byte array
      ADDRESS_LENGTH_LIMIT            // RAILGUN addresses are a length of 127
    );
```

## Example Parsing address 
```ts
    import { parse } from "@railgun-reloaded/0zk-addresses"
    const recipientRailgunAddress = "0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts";
    const addressData = parse(recipientRailgunAddress);
    console.log("recipientRailgunAddress", recipientRailgunAddress);
    console.log('addressData', addressData)
```

#### console output
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


## Install

```sh
npm install  @railgun-reloaded/0zk-addresses
```

## License

[MIT](LICENSE)
