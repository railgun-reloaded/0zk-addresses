/**
 * Error thrown when a value is not a valid RAILGUN (`0zk1`) address.
 */
class RailgunAddressError extends Error {
  /**
   * Creates a RailgunAddressError.
   * @param message - Human-readable description of the validation failure.
   */
  constructor (message: string) {
    super(message)
    this.name = 'RailgunAddressError'
  }
}

export { RailgunAddressError }
