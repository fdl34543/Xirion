import type { SignerAdapter } from "./SignerAdapter.js";

export class DummySolanaSigner implements SignerAdapter {
  readonly name = "dummy-solana";
  readonly chain = "solana" as const;

  async getAddress(): Promise<string> {
    throw new Error("Dummy signer has no address");
  }

  async signTransaction(rawTx: string): Promise<string> {
    throw new Error("Signing disabled (dummy signer)");
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }
}
