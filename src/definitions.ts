// This is the ASCII representation of the string "railgun\0"
const RAILGUN_ASCII = new Uint8Array([114, 97, 105, 108, 103, 117, 110, 0])
const ADDRESS_LENGTH_LIMIT = 127
const ALL_CHAINS_NETWORK_ID = new Uint8Array(8).fill(0xff)

const RAILGUN_ADDRESS_PREFIX = '0zk' as const
const CHAIN_ID_ANY = 0x00ff_ffff_ffff_ffffn as const
const CHAIN_ID_MASK = 0x00ff_ffff_ffff_ffffn as const
const CURRENT_ADDRESS_VERSION = 0x01 as const

enum ChainType {
  EVM = 0,
  ANY = 255,
}

type Chain = {
  id: bigint;
  type: ChainType;
}

type RailgunAddressLike = `${typeof RAILGUN_ADDRESS_PREFIX}1${string}`

type AddressData = {
  masterPublicKey: Uint8Array;
  viewingPublicKey: Uint8Array;
  chain?: Chain | undefined;
  version?: number | undefined;
}

export type { Chain, RailgunAddressLike, AddressData }
export {
  RAILGUN_ASCII,
  ADDRESS_LENGTH_LIMIT,
  ALL_CHAINS_NETWORK_ID,
  RAILGUN_ADDRESS_PREFIX,
  CHAIN_ID_ANY,
  CHAIN_ID_MASK,
  CURRENT_ADDRESS_VERSION,
  ChainType,
}
