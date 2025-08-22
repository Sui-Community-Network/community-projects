import { useWalletKit } from "@mysten/wallet-kit";

export default function ConnectWallet() {
  const { connect, disconnect, currentAccount } = useWalletKit();

  return (
    <div>
      {currentAccount?.address ? (
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Disconnect ({currentAccount.address.slice(0, 6)}...)
        </button>
      ) : (
        <button
          onClick={() => connect("default")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
