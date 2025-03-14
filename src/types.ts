enum ChainType {
  EVM = 0,
}

type Chain = {
  id: number;
  type: ChainType;
};

type RailgunAddressLike = `0zk1${string}`;

type AddressData = {
  masterPublicKey: Uint8Array;
  viewingPublicKey: Uint8Array;
  chain?: Optional<Chain>;
  version?: Optional<number>;
};

enum ByteLength {
  UINT_8 = 1,
  UINT_56 = 7,
  UINT_120 = 15,
  UINT_128 = 16,
  Address = 20,
  UINT_192 = 24,
  UINT_248 = 31,
  UINT_256 = 32,
}

export {
  ByteLength,
  ChainType,
  type Chain,
  type AddressData,
  type RailgunAddressLike,
};
