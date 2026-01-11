import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@suiet/wallet-kit';
// Import Auth để lấy User ID hiện tại
import { useAuth } from './AuthContext'; 

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

// Interface cho lịch sử thu gom rác (Dành cho Shipper)
export interface RecycleLog {
  id: string;
  customerName: string;
  wasteType: string;
  weight: number;
  ecoEarned: number;
  status: 'collected' | 'processed'; // Đã thu gom vs Đã về kho
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
  recycleLogs: RecycleLog[]; // List rác đã thu gom
  addEcoTokens: (amount: number, co2Amount: number) => void;
  stakeEco: (amount: number, type: 'vault' | 'product', name: string, apr: number, duration?: string) => void;
  unstakeEco: (id: string, feePercentage?: number) => void;
  swapEcoToVnd: (amount: number) => void;
  withdrawVnd: (amount: number) => void;
  addPurchase: (product: string, ecoEarned: number, co2Saved: number) => void;
  // HÀM MỚI CHO SHIPPER
  addRecycleItem: (customerName: string, wasteType: string, weight: number) => void;
  processRecyclingBatch: () => void; // Check-in kho
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
  const { user } = useAuth(); // Lấy user hiện tại để chia tách ví
  
  const [ecoBalance, setEcoBalance] = useState<number>(0);
  const [vndBalance, setVndBalance] = useState<number>(0);
  const [totalCO2Saved, setTotalCO2Saved] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [recycleLogs, setRecycleLogs] = useState<RecycleLog[]>([]);

  // KEY ĐỂ LƯU STORAGE: Phụ thuộc vào User ID (hoặc Role)
  const storageKey = user ? `ecoWalletData_${user.id}` : null;

  // Load data khi User thay đổi
  useEffect(() => {
    if (!storageKey) return; // Chưa login thì ko load

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const data = JSON.parse(savedData);
      setEcoBalance(data.ecoBalance || 0);
      setVndBalance(data.vndBalance || 0);
      setTotalCO2Saved(data.totalCO2Saved || 0);
      setStreak(data.streak || 0);
      setPurchaseHistory(data.purchaseHistory || []);
      setInvestments(data.investments || []);
      setNfts(data.nfts || []);
      setRecycleLogs(data.recycleLogs || []);
    } else {
      // Reset về mặc định nếu là user mới (hoặc role mới)
      setEcoBalance(0);
      setVndBalance(0);
      setTotalCO2Saved(0);
      setStreak(0);
      setPurchaseHistory([]);
      setInvestments([]);
      setNfts([]);
      setRecycleLogs([]);
    }
  }, [storageKey]);

  // Auto connect wallet fake logic
  useEffect(() => {
    if (wallet.connected && ecoBalance === 0) {
      setEcoBalance(150.50); // Welcome bonus
    }
  }, [wallet.connected]);

  // Save data khi state thay đổi
  useEffect(() => {
    if (!storageKey) return;
    const dataToSave = { ecoBalance, vndBalance, totalCO2Saved, streak, purchaseHistory, investments, nfts, recycleLogs };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [ecoBalance, vndBalance, totalCO2Saved, streak, purchaseHistory, investments, nfts, recycleLogs, storageKey]);

  // ... (Các hàm cũ giữ nguyên: addEcoTokens, stakeEco, unstakeEco, swap, withdraw, addPurchase) ...
  const addEcoTokens = (amount: number, co2Amount: number) => {
    setEcoBalance(prev => prev + amount);
    setTotalCO2Saved(prev => prev + co2Amount);
    setStreak(prev => prev + 1);
  };

  const stakeEco = (amount: number, type: 'vault' | 'product', name: string, apr: number, duration?: string) => {
    if (amount <= ecoBalance) {
      setEcoBalance(prev => prev - amount);
      const newInvest: Investment = { id: Date.now().toString(), type, name, amount, apr, date: new Date(), duration: duration || "Linh hoạt" };
      setInvestments(prev => [newInvest, ...prev]);
      if (type === 'product') {
        const newNFT: NFT = { id: `nft-${Date.now()}`, name: `Certificate: ${name}`, image: "https://cdn-icons-png.flaticon.com/512/11450/11450230.png", tier: amount > 50 ? 'Gold' : 'Silver', date: new Date() };
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

  const swapEcoToVnd = (amount: number) => {
    if (amount <= ecoBalance) {
      const fee = amount * 0.001;
      const amountAfterFee = amount - fee;
      setEcoBalance(prev => prev - amount);
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

  // --- LOGIC MỚI CHO SHIPPER ---
  
  // 1. Shipper xác nhận thu gom rác từ khách
  const addRecycleItem = (customerName: string, wasteType: string, weight: number) => {
    // Giả định: 1kg rác = 10 ECO (Chia sẻ giữa Shipper và Consumer sau này)
    const estimatedReward = weight * 10; 
    
    const newLog: RecycleLog = {
      id: `rec-${Date.now()}`,
      customerName,
      wasteType,
      weight,
      ecoEarned: estimatedReward,
      status: 'collected', // Mới thu gom, chưa về kho
      date: new Date()
    };
    setRecycleLogs(prev => [newLog, ...prev]);
  };

  // 2. Shipper về kho Check-in -> Nhận thưởng
  const processRecyclingBatch = () => {
    // Lọc ra các item đang ở trạng thái 'collected'
    const pendingItems = recycleLogs.filter(log => log.status === 'collected');
    if (pendingItems.length === 0) return;

    // Tính tổng thưởng cho Shipper (Shipper nhận 20% tổng giá trị lô rác)
    const totalValue = pendingItems.reduce((sum, item) => sum + item.ecoEarned, 0);
    const shipperReward = totalValue * 0.2; 

    // Cộng tiền cho Shipper
    setEcoBalance(prev => prev + shipperReward);
    
    // Cập nhật trạng thái logs thành 'processed'
    setRecycleLogs(prev => prev.map(log => 
      log.status === 'collected' ? { ...log, status: 'processed' } : log
    ));
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
    addPurchase,
    // Export mới
    recycleLogs,
    addRecycleItem,
    processRecyclingBatch
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};