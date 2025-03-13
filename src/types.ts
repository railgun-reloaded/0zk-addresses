export enum ChainType {
  EVM = 0,
}

export type Chain = {
  id: number;
  type: ChainType;
};

export type RailgunAddressLike = `0zk1${string}`;

export type AddressData = {
  masterPublicKey: bigint;
  viewingPublicKey: Uint8Array;
  chain?: Optional<Chain>;
  version?: Optional<number>;
};

export type BytesData = bigint | number | ArrayLike<number> | string;

export enum ByteLength {
  UINT_8 = 1,
  UINT_56 = 7,
  UINT_120 = 15,
  UINT_128 = 16,
  Address = 20,
  UINT_192 = 24,
  UINT_248 = 31,
  UINT_256 = 32,
}
