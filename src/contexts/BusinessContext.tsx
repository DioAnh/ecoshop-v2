import { createContext, useContext, useState, ReactNode } from 'react';

export interface GreenMaterial {
  id: string;
  name: string;
  source: string;
  co2Factor: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  greenMaterialId: string;
  materialWeight: number;
  co2Saved: number;
  tokenGenerated: number;
  status: 'active' | 'pending_verification' | 'verified_pass' | 'verified_fail';
  sales: number;
  lockedRevenue: number;
  verificationDate?: Date;
  verifierName?: string;
  failReason?: string;
}

interface BusinessContextType {
  products: BusinessProduct[];
  lockedPoolTotal: number;
  carbonCreditsTotal: number;
  availableMaterials: GreenMaterial[];
  calculateImpact: (materialId: string, weight: number) => { co2: number, tokens: number };
  addProduct: (product: BusinessProduct) => void;
  simulateSale: (productId: string) => void;
  verifyProduct: (productId: string, isPassed: boolean, reason?: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) throw new Error('useBusinessContext must be used within a BusinessProvider');
  return context;
};

// TRANSLATED MOCK MATERIALS
const MOCK_MATERIALS: GreenMaterial[] = [
  { id: 'mat_1', name: 'Rice Husk / Bran', source: 'Dong Thap Rice Coop', co2Factor: 1.5 },
  { id: 'mat_2', name: 'Coffee Grounds', source: 'Trung Nguyen Coffee Chain', co2Factor: 2.2 },
  { id: 'mat_3', name: 'Recycled Plastic (rPET)', source: 'EcoShipper Collective', co2Factor: 3.0 },
  { id: 'mat_4', name: 'Fabric Scraps', source: 'Viet Tien Garment Factory', co2Factor: 4.5 },
];

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<BusinessProduct[]>([
    {
      id: 'prod_demo_1',
      name: 'Coffee Grounds Deodorizer Socks',
      price: 85000,
      greenMaterialId: 'mat_2',
      materialWeight: 0.2,
      co2Saved: 0.44,
      tokenGenerated: 0.44,
      status: 'pending_verification',
      sales: 1250,
      lockedRevenue: 10625000
    },
    {
      id: 'prod_demo_fail',
      name: 'Grass Straws (Batch 2)',
      price: 45000,
      greenMaterialId: 'mat_1',
      materialWeight: 0.1,
      co2Saved: 0.2,
      tokenGenerated: 0.2,
      status: 'pending_verification',
      sales: 500,
      lockedRevenue: 2250000 
    }
  ]);

  const calculateImpact = (materialId: string, weight: number) => {
    const material = MOCK_MATERIALS.find(m => m.id === materialId);
    if (!material) return { co2: 0, tokens: 0 };
    const co2 = parseFloat((weight * material.co2Factor).toFixed(2));
    const tokens = co2; 
    return { co2, tokens };
  };

  const addProduct = (newProduct: BusinessProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const simulateSale = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const revenueToLock = p.price * 0.1; 
        return {
          ...p,
          sales: p.sales + 1,
          lockedRevenue: p.lockedRevenue + revenueToLock
        };
      }
      return p;
    }));
  };

  const verifyProduct = (productId: string, isPassed: boolean, reason?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        if (isPassed) {
          const platformFee = p.lockedRevenue * 0.01;
          const netRevenue = p.lockedRevenue - platformFee;
          console.log(`[SmartContract] Unlocked ${netRevenue} VND to Business Wallet. Fee: ${platformFee}`);
          return { ...p, status: 'verified_pass', verificationDate: new Date(), verifierName: 'VinaControl' };
        } else {
          const refundAmount = p.lockedRevenue * 0.9;
          const penaltyFee = p.lockedRevenue * 0.1;
          console.log(`[SmartContract] Refunded ${refundAmount} VND to Consumers. Penalty: ${penaltyFee}`);
          return { ...p, status: 'verified_fail', verificationDate: new Date(), verifierName: 'VinaControl', failReason: reason || "CO2 Data Fraud" };
        }
      }
      return p;
    }));
  };

  const lockedPoolTotal = products.filter(p => p.status === 'active' || p.status === 'pending_verification').reduce((acc, curr) => acc + curr.lockedRevenue, 0);
  const carbonCreditsTotal = products.reduce((acc, curr) => acc + (curr.co2Saved * curr.sales), 0);

  const value = {
    products,
    lockedPoolTotal,
    carbonCreditsTotal,
    availableMaterials: MOCK_MATERIALS,
    calculateImpact,
    addProduct,
    simulateSale,
    verifyProduct
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};