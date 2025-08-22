import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { useWalletKit } from "@mysten/wallet-kit";
import { MARKETPLACE_PACKAGE_ID, MARKETPLACE_WIDGET_PACKAGE_ID, COIN_TYPE, MARKETPLACE_ID } from "./contractIds";

// Initialize Sui client
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Get listed items from the marketplace
export const getListedItems = async (): Promise<any[]> => {
  try {
    // Fetch the marketplace object
    const marketplace = await client.getObject({
      id: MARKETPLACE_ID,
      options: { showContent: true }
    });

    // In a real implementation, we would parse the marketplace object
    // and extract the listed items. This is a simplified version.
    
    // For now, return mock data that simulates what you'd get from the blockchain
    return [
      {
        id: "1",
        name: "Rare Digital Art #123",
        price: "0.5",
        seller: "0x742d35Cc6634C893292Ce8bB6239C002Ad8e6b59",
        objectId: "0x1",
        type: `${MARKETPLACE_WIDGET_PACKAGE_ID}::marketplaceWidget::Widget`
      },
      {
        id: "2",
        name: "Exclusive Widget #456",
        price: "1.2",
        seller: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
        objectId: "0x2",
        type: `${MARKETPLACE_WIDGET_PACKAGE_ID}::marketplaceWidget::Widget`
      },
      // More items...
    ];
  } catch (error) {
    console.error("Error fetching listed items:", error);
    return [];
  }
};

// Get items owned by a specific address
export const getOwnedItems = async (address: string): Promise<any[]> => {
  try {
    // Fetch objects owned by the address
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true }
    });

    // Filter for Widget objects
    const widgets = objects.data.filter(obj => 
      obj.data?.type?.includes('marketplaceWidget::Widget')
    );

    // Transform the data into a format the UI can use
    return widgets.map((obj, index) => ({
      id: `owned-${index}`,
      name: `My Widget #${index + 1}`,
      price: "0",
      seller: address,
      objectId: obj.data?.objectId,
      type: obj.data?.type
    }));
  } catch (error) {
    console.error("Error fetching owned items:", error);
    return [];
  }
};

// Get profits for a specific address
export const getProfits = async (address: string): Promise<string> => {
  try {
    // In a real implementation, we would check the marketplace for pending profits
    // This is a simplified version that returns mock data
    const coins = await client.getCoins({
      owner: address,
      coinType: COIN_TYPE
    });
    
    // Calculate total balance
    const totalBalance = coins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
    return (totalBalance / 1000000000).toFixed(3); // Convert from MIST to SUI
  } catch (error) {
    console.error("Error fetching profits:", error);
    return "0";
  }
};

// Mint a new widget
export const mintWidget = async (signAndExecuteTransactionBlock: any): Promise<void> => {
  try {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${MARKETPLACE_WIDGET_PACKAGE_ID}::marketplaceWidget::mint`,
      arguments: [
        tx.pure("My New Widget"), // Name
        tx.pure("A wonderful widget"), // Description
        tx.pure("https://example.com/widget.png"), // URL
      ]
    });

    await signAndExecuteTransactionBlock({ transactionBlock: tx });
    alert("Widget minted successfully!");
  } catch (error) {
    console.error("Error minting widget:", error);
    alert("Failed to mint widget. Please try again.");
  }
};

// List an item for sale
export const listItem = async (signAndExecuteTransactionBlock: any, itemId: string, price: string): Promise<void> => {
  try {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(parseInt(price) * 1000000000)]); // Convert SUI to MIST
    
    tx.moveCall({
      target: `${MARKETPLACE_PACKAGE_ID}::marketplace::list`,
      arguments: [
        tx.object(MARKETPLACE_ID),
        tx.object(itemId),
        coin,
      ]
    });

    await signAndExecuteTransactionBlock({ transactionBlock: tx });
    alert(`Item listed for ${price} SUI successfully!`);
  } catch (error) {
    console.error("Error listing item:", error);
    alert("Failed to list item. Please try again.");
  }
};

// Buy an item
export const buyItem = async (signAndExecuteTransactionBlock: any, itemId: string, price: string): Promise<void> => {
  try {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(parseInt(price) * 1000000000)]); // Convert SUI to MIST
    
    tx.moveCall({
      target: `${MARKETPLACE_PACKAGE_ID}::marketplace::buy_and_take`,
      arguments: [
        tx.object(MARKETPLACE_ID),
        tx.object(itemId),
        coin,
      ]
    });

    await signAndExecuteTransactionBlock({ transactionBlock: tx });
    alert(`Item purchased for ${price} SUI successfully!`);
  } catch (error) {
    console.error("Error buying item:", error);
    alert("Failed to buy item. Please try again.");
  }
};

// Delist an item
export const delistItem = async (signAndExecuteTransactionBlock: any, itemId: string): Promise<void> => {
  try {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${MARKETPLACE_PACKAGE_ID}::marketplace::delist_and_take`,
      arguments: [
        tx.object(MARKETPLACE_ID),
        tx.object(itemId),
      ]
    });

    await signAndExecuteTransactionBlock({ transactionBlock: tx });
    alert("Item delisted successfully!");
  } catch (error) {
    console.error("Error delisting item:", error);
    alert("Failed to delist item. Please try again.");
  }
};

// Withdraw profits
export const withdrawProfits = async (signAndExecuteTransactionBlock: any): Promise<void> => {
  try {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${MARKETPLACE_PACKAGE_ID}::marketplace::take_profits_and_keep`,
      arguments: [
        tx.object(MARKETPLACE_ID),
      ]
    });

    await signAndExecuteTransactionBlock({ transactionBlock: tx });
    alert("Profits withdrawn successfully!");
  } catch (error) {
    console.error("Error withdrawing profits:", error);
    alert("Failed to withdraw profits. Please try again.");
  }
};