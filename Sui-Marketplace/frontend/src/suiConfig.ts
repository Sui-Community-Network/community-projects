// src/suiConfig.ts
export const SUI_NETWORK = "devnet"; // or "testnet" / "mainnet"

// Replace these with what you get from `sui client publish`
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const MODULE_NAME = "marketplace";
export const MINT_FUNCTION = "mint_item"; // whatever your Move entry function is
