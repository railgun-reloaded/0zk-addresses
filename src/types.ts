export enum ChainType {
  EVM = 0,
  ANY = 255,
}

export type Chain = {
  id: number;
  type: ChainType;
};

export type RailgunAddressLike = `0zk1${string}`;

export type AddressData = {
  masterPublicKey: Uint8Array;
  viewingPublicKey: Uint8Array;
  chain?: Optional<Chain>;
  version?: Optional<number>;
};
