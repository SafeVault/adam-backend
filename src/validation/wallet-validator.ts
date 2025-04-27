export function isValidStarknetAddress(address: string): boolean {
  // Starknet addresses are 64 hex characters, optionally with '0x' prefix
  return /^(0x)?[a-fA-F0-9]{64}$/.test(address);
}
