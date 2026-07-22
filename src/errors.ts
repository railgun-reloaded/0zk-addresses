type RailgunAddressErrorCode =
  /** The address does not begin with the `0zk1` prefix. */
  | 'InvalidPrefix'
  /** The bech32m checksum failed: the address is corrupt or mistyped. */
  | 'InvalidChecksum'
  /** The encoded address length is outside the bech32m bounds. */
  | 'InvalidLength'
  /** The address version is not the current supported version. */
  | 'UnsupportedVersion'
  /** The master public key is not 32 bytes. */
  | 'InvalidMasterPublicKeyLength'
  /** The viewing public key is not 32 bytes. */
  | 'InvalidViewingPublicKeyLength'

/**
 * Error raised when RAILGUN (`0zk1`) address validation fails. The `code`
 * field gives the specific failure.
 */
class RailgunAddressError extends Error {
  /**
   * The discriminator identifying which failure mode raised this error.
   */
  readonly code: RailgunAddressErrorCode

  /**
   * Construct a RailgunAddressError.
   * @param code - One of the `RailgunAddressErrorCode` values.
   * @param message - Human-readable description of the validation failure.
   * @param options - Optional ErrorOptions for chaining a `cause`.
   */
  constructor (code: RailgunAddressErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'RailgunAddressError'
    this.code = code
  }
}

export { RailgunAddressError }
export type { RailgunAddressErrorCode }
