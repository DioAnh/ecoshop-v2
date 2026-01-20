import { createContext, useContext, useState, ReactNode } from 'react';

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  totalFunded: number;
  remainingBalance: number;
  focusArea: 'Agriculture' | 'Plastic' | 'Energy';
  // New Financial Fields
  apy: number;
  riskRating: 'Low' | 'Medium' | 'High';
  lockPeriod: number; // days
}

interface GreenFundContextType {
  sponsors: Sponsor[];
  grantPoolBalance: number;
  revenuePoolBalance: number;
  safetyReserveBalance: number; // New Field
  disburseReward: (amount: number, type: 'user_reward' | 'business_grant') => boolean;
  collectProtocolFee: (amount: number) => void;
  addSponsorFund: (sponsorId: string, amount: number) => void;
}

const GreenFundContext = createContext<GreenFundContextType | undefined>(undefined);

export const useGreenFund = () => {
  const context = useContext(GreenFundContext);
  if (!context) throw new Error('useGreenFund must be used within a GreenFundProvider');
  return context;
};

// Dữ liệu "Cá mập" ESG (Updated with Financials)
const INITIAL_SPONSORS: Sponsor[] = [
  { 
    id: 'sp_vinamilk', 
    name: 'Vinamilk Green Farm', 
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vinamilk-V.png', 
    totalFunded: 5000000000, 
    remainingBalance: 4200000000, 
    focusArea: 'Agriculture',
    apy: 12.5,
    riskRating: 'Low',
    lockPeriod: 90
  },
  { 
    id: 'sp_unilever', 
    name: 'Unilever Future Planet', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Unilever.svg/1200px-Unilever.svg.png', 
    totalFunded: 10000000000, 
    remainingBalance: 8500000000, 
    focusArea: 'Plastic',
    apy: 14.2,
    riskRating: 'Medium',
    lockPeriod: 60 
  },
  { 
    id: 'sp_hcm_gov', 
    name: 'Green Bond HCMC', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Logo_Ho_Chi_Minh_City.svg/1200px-Logo_Ho_Chi_Minh_City.svg.png', 
    totalFunded: 20000000000, 
    remainingBalance: 19800000000, 
    focusArea: 'Energy',
    apy: 8.5,
    riskRating: 'Low',
    lockPeriod: 365
  }
];

export const GreenFundProvider = ({ children }: { children: ReactNode }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);
  const [revenuePoolBalance, setRevenuePoolBalance] = useState<number>(125600000); 
  const [safetyReserveBalance, setSafetyReserveBalance] = useState<number>(6280000); // 5% of Revenue

  const grantPoolBalance = sponsors.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  const disburseReward = (amount: number, type: 'user_reward' | 'business_grant') => {
    const sponsorIndex = sponsors.findIndex(s => s.remainingBalance >= amount);
    if (sponsorIndex !== -1) {
      const updatedSponsors = [...sponsors];
      updatedSponsors[sponsorIndex].remainingBalance -= amount;
      setSponsors(updatedSponsors);
      console.log(`[SmartContract] Disbursed ${amount} VND from Vault: ${updatedSponsors[sponsorIndex].name}`);
      return true;
    }
    return false;
  };

  const collectProtocolFee = (orderTotal: number) => {
    const feePercent = 0.05; 
    const feeAmount = orderTotal * feePercent;
    
    // Split Fee: 95% Revenue, 5% Safety Reserve
    const safetyAmount = feeAmount * 0.05;
    const revenueAmount = feeAmount * 0.95;

    setRevenuePoolBalance(prev => prev + revenueAmount);
    setSafetyReserveBalance(prev => prev + safetyAmount);
    
    console.log(`[SmartContract] Fee Collected: ${feeAmount} (Rev: ${revenueAmount}, Safety: ${safetyAmount})`);
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
      revenuePoolBalance,
      safetyReserveBalance,
      disburseReward, 
      collectProtocolFee, 
      addSponsorFund 
    }}>
      {children}
    </GreenFundContext.Provider>
  );
};