import { createContext, useContext, useState, ReactNode } from 'react';

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  totalFunded: number;
  remainingBalance: number;
  focusArea: 'Agriculture' | 'Plastic' | 'Energy';
}

interface GreenFundContextType {
  sponsors: Sponsor[];
  grantPoolBalance: number;   // Tổng quỹ tài trợ (Grants)
  revenuePoolBalance: number; // Tổng quỹ doanh thu thực (Real Yield)
  disburseReward: (amount: number, type: 'user_reward' | 'business_grant') => boolean;
  collectProtocolFee: (amount: number) => void; // Hàm thu phí giao dịch
  addSponsorFund: (sponsorId: string, amount: number) => void;
}

const GreenFundContext = createContext<GreenFundContextType | undefined>(undefined);

export const useGreenFund = () => {
  const context = useContext(GreenFundContext);
  if (!context) throw new Error('useGreenFund must be used within a GreenFundProvider');
  return context;
};

// Dữ liệu giả lập các "Cá mập" ESG
const INITIAL_SPONSORS: Sponsor[] = [
  { 
    id: 'sp_vinamilk', 
    name: 'Vinamilk Green Farm', 
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vinamilk-V.png', 
    totalFunded: 5000000000, 
    remainingBalance: 4200000000, 
    focusArea: 'Agriculture' 
  },
  { 
    id: 'sp_unilever', 
    name: 'Unilever Future Planet', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Unilever.svg/1200px-Unilever.svg.png', 
    totalFunded: 10000000000, 
    remainingBalance: 8500000000, 
    focusArea: 'Plastic' 
  },
  { 
    id: 'sp_hcm_gov', 
    name: 'Green Bond HCMC', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Logo_Ho_Chi_Minh_City.svg/1200px-Logo_Ho_Chi_Minh_City.svg.png', 
    totalFunded: 20000000000, 
    remainingBalance: 19800000000, 
    focusArea: 'Energy' 
  }
];

export const GreenFundProvider = ({ children }: { children: ReactNode }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);
  
  // Quỹ doanh thu thực tế từ phí giao dịch (Protocol Revenue)
  // Khởi tạo một con số thực tế để demo
  const [revenuePoolBalance, setRevenuePoolBalance] = useState<number>(125600000); 

  const grantPoolBalance = sponsors.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  // 1. Hàm giải ngân từ Quỹ Tài Trợ (Grants)
  const disburseReward = (amount: number, type: 'user_reward' | 'business_grant') => {
    const sponsorIndex = sponsors.findIndex(s => s.remainingBalance >= amount);
    if (sponsorIndex !== -1) {
      const updatedSponsors = [...sponsors];
      updatedSponsors[sponsorIndex].remainingBalance -= amount;
      setSponsors(updatedSponsors);
      console.log(`[SmartContract] Disbursed ${amount} VND from Grant Pool (${updatedSponsors[sponsorIndex].name})`);
      return true;
    }
    return false;
  };

  // 2. Hàm thu phí giao dịch vào Quỹ Doanh Thu (Revenue)
  // Đây là "Real Yield" - tiền thật từ việc bán hàng
  const collectProtocolFee = (orderTotal: number) => {
    const feePercent = 0.05; // 5% phí giao dịch
    const feeAmount = orderTotal * feePercent;
    
    setRevenuePoolBalance(prev => prev + feeAmount);
    console.log(`[SmartContract] Collected ${feeAmount} VND Protocol Fee into Revenue Pool`);
  };

  const addSponsorFund = (sponsorId: string, amount: number) => {
    setSponsors(prev => prev.map(s => 
      s.id === sponsorId 
        ? { ...s, totalFunded: s.totalFunded + amount, remainingBalance: s.remainingBalance + amount }
        : s
    ));
  };

  return (
    <GreenFundContext.Provider value={{ 
      sponsors, 
      grantPoolBalance, 
      revenuePoolBalance, // Export biến này ra để hiển thị
      disburseReward, 
      collectProtocolFee, // Export hàm này để Checkout gọi
      addSponsorFund 
    }}>
      {children}
    </GreenFundContext.Provider>
  );
};