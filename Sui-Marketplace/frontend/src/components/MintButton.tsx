import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useWalletKit } from "@mysten/wallet-kit";
import { PACKAGE_ID, MODULE_NAME, MINT_FUNCTION } from "../suiConfig";

export default function MintButton() {
  const { signAndExecuteTransactionBlock } = useWalletKit();

  const handleMint = async () => {
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${MINT_FUNCTION}`,
        arguments: [tx.pure("My Item")], // adjust depending on your Move function
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });

      console.log("Mint success:", result);
      alert("Minted successfully!");
    } catch (error) {
      console.error("Mint failed:", error);
      alert("Mint failed. Check console.");
    }
  };

  return (
    <button
      onClick={handleMint}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Mint Item
    </button>
  );
}
