// src/agent/execution/ExecutionAdapter.ts

import type { ChainType } from "../signer/SignerAdapter.js";

export type ExecutionMode =
  | "simulate"
  | "sign-only"
  | "execute";

export interface ExecutionResult {
  mode: ExecutionMode;
  txHash?: string;
  signedTx?: string;
  simulationResult?: unknown;
  timestamp: number;
}

export interface ExecutionAdapter {
  /**
   * Human-readable identifier
   * Example: "solana-rpc", "mcpay", "simulation-only"
   */
  readonly name: string;

  /**
   * Chain supported by this adapter
   */
  readonly chain: ChainType;

  /**
   * Execution mode supported
   */
  readonly mode: ExecutionMode;

  /**
   * Execute a prepared transaction
   *
   * Input MUST be:
   * - already decided
   * - already built
   * - deterministic
   */
  execute(
    preparedTx: string,
    signer?: {
      signTransaction: (rawTx: string) => Promise<string>;
    }
  ): Promise<ExecutionResult>;

  /**
   * Health check
   */
  isAvailable(): Promise<boolean>;
}
