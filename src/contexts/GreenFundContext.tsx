import { createContext, useContext, useState, ReactNode } from 'react';

export interface Sponsor {
  id: string;
  name: string;
  logo: string; // URL logo
  totalFunded: number; // Tổng tiền đã tài trợ (VND)
  remainingBalance: number; // Số dư còn lại trong Smart Contract
  focusArea: 'Agriculture' | 'Plastic' | 'Energy'; // Lĩnh vực tài trợ
}

interface GreenFundContextType {
  sponsors: Sponsor[];
  totalPoolBalance: number; // Tổng quỹ toàn sàn
  disburseReward: (amount: number, type: 'user_reward' | 'business_grant') => boolean;
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
    totalFunded: 5000000000, // 5 tỷ
    remainingBalance: 4200000000, 
    focusArea: 'Agriculture' 
  },
  { 
    id: 'sp_unilever', 
    name: 'Unilever Future Planet', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Unilever.svg/1200px-Unilever.svg.png', 
    totalFunded: 10000000000, // 10 tỷ
    remainingBalance: 8500000000, 
    focusArea: 'Plastic' 
  },
  { 
    id: 'sp_hcm_gov', 
    name: 'Green Bond HCMC', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Logo_Ho_Chi_Minh_City.svg/1200px-Logo_Ho_Chi_Minh_City.svg.png', 
    totalFunded: 20000000000, // 20 tỷ
    remainingBalance: 19800000000, 
    focusArea: 'Energy' 
  }
];

export const GreenFundProvider = ({ children }: { children: ReactNode }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);

  const totalPoolBalance = sponsors.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  // Hàm mô phỏng Smart Contract giải ngân tự động
  const disburseReward = (amount: number, type: 'user_reward' | 'business_grant') => {
    // Logic: Tìm quỹ nào còn tiền và phù hợp để trừ tiền
    // Ở đây demo trừ vào quỹ đầu tiên còn tiền
    const sponsorIndex = sponsors.findIndex(s => s.remainingBalance >= amount);
    
    if (sponsorIndex !== -1) {
      const updatedSponsors = [...sponsors];
      updatedSponsors[sponsorIndex].remainingBalance -= amount;
      setSponsors(updatedSponsors);
      
      console.log(`[SmartContract] Disbursed ${amount} VND from ${updatedSponsors[sponsorIndex].name} for ${type}`);
      return true; // Giải ngân thành công
    }
    return false; // Quỹ hết tiền
  };

  const addSponsorFund = (sponsorId: string, amount: number) => {
    setSponsors(prev => prev.map(s => 
      s.id === sponsorId 
        ? { ...s, totalFunded: s.totalFunded + amount, remainingBalance: s.remainingBalance + amount }
        : s
    ));
  };

  return (
    <GreenFundContext.Provider value={{ sponsors, totalPoolBalance, disburseReward, addSponsorFund }}>
      {children}
    </GreenFundContext.Provider>
  );
};