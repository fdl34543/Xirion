export type ChainType = "solana" | "evm";

export interface SignerAdapter {
  /**
   * Human-readable identifier
   * Example: "local-solana", "ledger", "mpc-remote"
   */
  readonly name: string;

  /**
   * Chain supported by this signer
   */
  readonly chain: ChainType;

  /**
   * Returns the on-chain address controlled by this signer
   * Must be stable and publicly verifiable
   */
  getAddress(): Promise<string>;

  /**
   * Sign a raw transaction
   * - Solana: base64-encoded unsigned transaction
   * - EVM: serialized unsigned transaction hex
   *
   * MUST NOT broadcast
   */
  signTransaction(
    rawTx: string
  ): Promise<string>;

  /**
   * Optional: sign arbitrary message
   * Used for proofs, auth, or DAO approvals
   */
  signMessage?(
    message: string
  ): Promise<string>;

  /**
   * Health check
   * Ensures signer is available and authorized
   */
  isAvailable(): Promise<boolean>;
}
