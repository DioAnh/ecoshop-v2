import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@suiet/wallet-kit';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  shortAddress: string | null;
  ecoBalance: number;
  totalCO2Saved: number;
  rank: string;
  streak: number;
  addEcoTokens: (amount: number, co2Amount: number) => void;
  stakeEco: (amount: number) => void;
  stakedAmount: number;
  purchaseHistory: PurchaseRecord[];
  addPurchase: (product: string, ecoEarned: number, co2Saved: number) => void;
}

export interface PurchaseRecord {
  id: string;
  product: string;
  ecoEarned: number;
  co2Saved: number;
  date: Date;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};

// Helper to shorten wallet address
const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Calculate rank based on total CO2 saved
const calculateRank = (co2Saved: number): string => {
  if (co2Saved >= 100) return 'Chiến thần Eco';
  if (co2Saved >= 50) return 'Đại sứ Xanh';
  if (co2Saved >= 20) return 'Người tiên phong';
  if (co2Saved >= 5) return 'Eco Warrior';
  return 'Người mới';
};

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  
  // Simulated eco data (will be stored in localStorage for demo)
  const [ecoBalance, setEcoBalance] = useState<number>(0);
  const [totalCO2Saved, setTotalCO2Saved] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('ecoWalletData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setEcoBalance(data.ecoBalance || 0);
      setTotalCO2Saved(data.totalCO2Saved || 0);
      setStreak(data.streak || 0);
      setStakedAmount(data.stakedAmount || 0);
      setPurchaseHistory(data.purchaseHistory || []);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      ecoBalance,
      totalCO2Saved,
      streak,
      stakedAmount,
      purchaseHistory
    };
    localStorage.setItem('ecoWalletData', JSON.stringify(dataToSave));
  }, [ecoBalance, totalCO2Saved, streak, stakedAmount, purchaseHistory]);

  const addEcoTokens = (amount: number, co2Amount: number) => {
    setEcoBalance(prev => prev + amount);
    setTotalCO2Saved(prev => prev + co2Amount);
    setStreak(prev => prev + 1);
  };

  const stakeEco = (amount: number) => {
    if (amount <= ecoBalance) {
      setEcoBalance(prev => prev - amount);
      setStakedAmount(prev => prev + amount);
    }
  };

  const addPurchase = (product: string, ecoEarned: number, co2Saved: number) => {
    const newPurchase: PurchaseRecord = {
      id: Date.now().toString(),
      product,
      ecoEarned,
      co2Saved,
      date: new Date()
    };
    setPurchaseHistory(prev => [newPurchase, ...prev]);
    addEcoTokens(ecoEarned, co2Saved);
  };

  const value: WalletContextType = {
    isConnected: wallet.connected,
    walletAddress: wallet.address || null,
    shortAddress: wallet.address ? shortenAddress(wallet.address) : null,
    ecoBalance,
    totalCO2Saved,
    rank: calculateRank(totalCO2Saved),
    streak,
    addEcoTokens,
    stakeEco,
    stakedAmount,
    purchaseHistory,
    addPurchase
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
