import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWalletKit } from "@mysten/wallet-kit";
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { COIN_TYPE } from '../utils/contractIds';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  balance: string;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  balance: "0",
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentAccount, isConnected } = useWalletKit();
  const [balance, setBalance] = useState("0");
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  useEffect(() => {
    const fetchBalance = async () => {
      if (!currentAccount?.address) {
        setBalance("0");
        return;
      }

      try {
        const coins = await client.getCoins({
          owner: currentAccount.address,
          coinType: COIN_TYPE
        });
        
        // Calculate total balance
        const totalBalance = coins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
        setBalance((totalBalance / 1000000000).toFixed(3)); // Convert from MIST to SUI
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0");
      }
    };

    fetchBalance();
    
    // Set up interval to periodically update balance
    const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [currentAccount, isConnected]);

  return (
    <WalletContext.Provider
      value={{
        connected: isConnected,
        address: currentAccount?.address || null,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};