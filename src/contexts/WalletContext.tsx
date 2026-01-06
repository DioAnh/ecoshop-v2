import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@suiet/wallet-kit';

export interface Investment {
  id: string;
  type: 'vault' | 'product';
  name: string;
  amount: number;
  apr: number;
  date: string | Date;
  duration: string;
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  tier: string;
  date: Date;
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  shortAddress: string | null;
  ecoBalance: number;
  vndBalance: number;
  totalCO2Saved: number;
  rank: string;
  streak: number;
  stakedAmount: number;
  investments: Investment[];
  nfts: NFT[];
  addEcoTokens: (amount: number, co2Amount: number) => void;
  stakeEco: (amount: number, type: 'vault' | 'product', name: string, apr: number, duration?: string) => void;
  unstakeEco: (id: string, feePercentage?: number) => void;
  swapEcoToVnd: (amount: number) => void;
  withdrawVnd: (amount: number) => void;
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
  if (context === undefined) throw new Error('useWalletContext must be used within a WalletContextProvider');
  return context;
};

const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const calculateRank = (co2Saved: number): string => {
  if (co2Saved >= 100) return 'Chiến thần Eco';
  if (co2Saved >= 50) return 'Đại sứ Xanh';
  if (co2Saved >= 20) return 'Người tiên phong';
  if (co2Saved >= 5) return 'Eco Warrior';
  return 'Người mới';
};

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  
  const [ecoBalance, setEcoBalance] = useState<number>(0);
  const [vndBalance, setVndBalance] = useState<number>(0);
  const [totalCO2Saved, setTotalCO2Saved] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('ecoWalletData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setEcoBalance(data.ecoBalance || 0);
      setVndBalance(data.vndBalance || 0);
      setTotalCO2Saved(data.totalCO2Saved || 0);
      setStreak(data.streak || 0);
      setPurchaseHistory(data.purchaseHistory || []);
      setInvestments(data.investments || []);
      setNfts(data.nfts || []);
    }
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      setEcoBalance(prev => prev <= 0.5 ? 150.50 : prev);
      setTotalCO2Saved(prev => prev === 0 ? 50.5 : prev);
      setStreak(prev => prev === 0 ? 5 : prev);
    }
  }, [wallet.connected]);

  useEffect(() => {
    const dataToSave = { ecoBalance, vndBalance, totalCO2Saved, streak, purchaseHistory, investments, nfts };
    localStorage.setItem('ecoWalletData', JSON.stringify(dataToSave));
  }, [ecoBalance, vndBalance, totalCO2Saved, streak, purchaseHistory, investments, nfts]);

  const addEcoTokens = (amount: number, co2Amount: number) => {
    setEcoBalance(prev => prev + amount);
    setTotalCO2Saved(prev => prev + co2Amount);
    setStreak(prev => prev + 1);
  };

  const stakeEco = (amount: number, type: 'vault' | 'product', name: string, apr: number, duration?: string) => {
    if (amount <= ecoBalance) {
      setEcoBalance(prev => prev - amount);
      const newInvest: Investment = {
        id: Date.now().toString(),
        type,
        name,
        amount,
        apr,
        date: new Date(),
        duration: duration || "Linh hoạt"
      };
      setInvestments(prev => [newInvest, ...prev]);

      if (type === 'product') {
        const newNFT: NFT = {
          id: `nft-${Date.now()}`,
          name: `Certificate: ${name}`,
          image: "https://cdn-icons-png.flaticon.com/512/11450/11450230.png",
          tier: amount > 50 ? 'Gold' : 'Silver',
          date: new Date()
        };
        setNfts(prev => [newNFT, ...prev]);
      }
    }
  };

  const unstakeEco = (id: string, feePercentage: number = 0) => {
    const investment = investments.find(i => i.id === id);
    if (!investment) return;
    const feeAmount = investment.amount * (feePercentage / 100);
    const returnAmount = investment.amount - feeAmount;
    setEcoBalance(prev => prev + returnAmount);
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  // --- LOGIC SWAP MỚI (PHÍ 0.1%) ---
  const swapEcoToVnd = (amount: number) => {
    if (amount <= ecoBalance) {
      const fee = amount * 0.001; // 0.1%
      const amountAfterFee = amount - fee;
      
      setEcoBalance(prev => prev - amount);
      // Quy đổi: 1 ECO = 1000 VND
      setVndBalance(prev => prev + (amountAfterFee * 1000));
    }
  };

  const withdrawVnd = (amount: number) => {
    if (amount <= vndBalance) {
      setVndBalance(prev => prev - amount);
    }
  };

  const addPurchase = (product: string, ecoEarned: number, co2Saved: number) => {
    const newPurchase = { id: Date.now().toString(), product, ecoEarned, co2Saved, date: new Date() };
    setPurchaseHistory(prev => [newPurchase, ...prev]);
    addEcoTokens(ecoEarned, co2Saved);
  };

  const stakedAmount = investments.reduce((acc, curr) => acc + curr.amount, 0);

  const value: WalletContextType = {
    isConnected: wallet.connected,
    walletAddress: wallet.address || null,
    shortAddress: wallet.address ? shortenAddress(wallet.address) : null,
    ecoBalance,
    vndBalance,
    totalCO2Saved,
    rank: calculateRank(totalCO2Saved),
    streak,
    addEcoTokens,
    stakeEco,
    unstakeEco,
    swapEcoToVnd,
    withdrawVnd,
    stakedAmount,
    investments,
    nfts,
    purchaseHistory,
    addPurchase
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};