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

export { ChainType, type Chain, type AddressData, type RailgunAddressLike };
