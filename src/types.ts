export const RAILGUN_ADDRESS_PREFIX = "0zk" as const;
export const CHAIN_ID_ANY = 0x00ff_ffff_ffff_ffffn as const;
export const CHAIN_ID_MASK = 0x00ff_ffff_ffff_ffffn as const;

export enum ChainType {
  EVM = 0,
  ANY = 255,
}

export type Chain = {
  id: bigint;
  type: ChainType;
};

export type RailgunAddressLike = `${typeof RAILGUN_ADDRESS_PREFIX}1${string}`;

export type AddressData = {
  masterPublicKey: Uint8Array;
  viewingPublicKey: Uint8Array;
  chain?: Optional<Chain>;
  version?: Optional<number>;
};
