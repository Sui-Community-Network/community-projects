import { ReactNode, createContext, useContext } from "react";
import { useWalletKit } from "@mysten/wallet-kit";

type WalletContextType = {
  connect: (walletName: string) => void;
  disconnect: () => void;
  address: string | null;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { connect, disconnect, currentAccount } = useWalletKit();

  return (
    <WalletContext.Provider
      value={{
        connect: (walletName: string) => connect(walletName).catch(console.error),
        disconnect,
        address: currentAccount?.address || null,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
};
