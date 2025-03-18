// This is the ASCII representation of the string "railgun\0"
export const RAILGUN_ASCII = new Uint8Array([
  114, 97, 105, 108, 103, 117, 110, 0,
]);
export const ADDRESS_LENGTH_LIMIT = 127;
export const ALL_CHAINS_NETWORK_ID = new Uint8Array(8).fill(0xff);

export const RAILGUN_ADDRESS_PREFIX = "0zk" as const;
export const CHAIN_ID_ANY = 0x00ff_ffff_ffff_ffffn as const;
export const CHAIN_ID_MASK = 0x00ff_ffff_ffff_ffffn as const;
export const CURRENT_ADDRESS_VERSION = 0x01 as const;

export enum ChainType {
  EVM = 0,
  BSC = 1, // bsc evm uses type 1.
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
