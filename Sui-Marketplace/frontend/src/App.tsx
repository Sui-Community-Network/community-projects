import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletKitProvider } from "@mysten/wallet-kit";
import { WalletProvider } from "./context/WalletContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import MyItems from "./pages/MyItems";
import Earnings from "./pages/Earnings";
import Footer from "./components/Footer";
import ConnectWallet from "./components/ConnectWallet";
import MintButton from "./components/MintButton";

function App() {
  return (
    <WalletKitProvider>
      <WalletProvider>
        <MarketplaceProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              {/* Navbar */}
              <Navbar />

              {/* Main Content */}
              <main className="flex-grow flex flex-col items-center gap-4 p-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/my-items" element={<MyItems />} />
                  <Route path="/earnings" element={<Earnings />} />
                </Routes>

                {/* Wallet + Mint Section */}
                <h1 className="text-2xl font-bold">Sui Marketplace</h1>
                <ConnectWallet />
                <MintButton />
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </Router>
        </MarketplaceProvider>
      </WalletProvider>
    </WalletKitProvider>
  );
}

export default App;
