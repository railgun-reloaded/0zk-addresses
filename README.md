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
  // example composotion, not proper byte construction.
  addressBytes = versionBytes + masterPublicKeyBytes + networkInfoBytes + viewingPublicKeyBytes;
  

```
## How is a RAILGUN Address Encoded? 
```ts
  bech32m.encode(
      RAILGUN_ADDRESS_PREFIX, // 0zk
      bech32m.toWords(addressBuffer),
      ADDRESS_LENGTH_LIMIT // RAILGUN addresses are a length of 127
    );
```



## Install

```sh
npm install  @railgun-reloaded/0zk-addresses
```

## License

[MIT](LICENSE)
