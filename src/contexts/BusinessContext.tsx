import { createContext, useContext, useState, ReactNode } from 'react';

// Cấu trúc dữ liệu cho Chuỗi giá trị (Value Chain)
export interface GreenMaterial {
  id: string;
  name: string;
  source: string; // Nguồn gốc (VD: Phế phẩm từ Cty A)
  co2Factor: number; // Hệ số giảm CO2 per kg
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  greenMaterialId: string;
  materialWeight: number; // Khối lượng nguyên liệu tái chế sử dụng
  co2Saved: number; // AI tính toán
  tokenGenerated: number; // AI tính toán
  status: 'active' | 'pending_verification' | 'verified_pass' | 'verified_fail';
  sales: number;
  lockedRevenue: number; // Doanh thu đang bị khóa
  // Thêm field cho verification
  verificationDate?: Date;
  verifierName?: string;
  failReason?: string;
}

interface BusinessContextType {
  products: BusinessProduct[];
  lockedPoolTotal: number;
  carbonCreditsTotal: number;
  availableMaterials: GreenMaterial[]; // Danh sách nguyên liệu đầu vào có sẵn
  // Hàm AI Simulator
  calculateImpact: (materialId: string, weight: number) => { co2: number, tokens: number };
  addProduct: (product: BusinessProduct) => void;
  simulateSale: (productId: string) => void; // Giả lập bán hàng để test Locked Pool
  // Hàm Verification (Task 4)
  verifyProduct: (productId: string, isPassed: boolean, reason?: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// --- QUAN TRỌNG: DÒNG NÀY ĐANG BỊ THIẾU GÂY RA LỖI ---
export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) throw new Error('useBusinessContext must be used within a BusinessProvider');
  return context;
};

// Dữ liệu Mock: Các nguồn phế phẩm nông nghiệp có sẵn
const MOCK_MATERIALS: GreenMaterial[] = [
  { id: 'mat_1', name: 'Vỏ Trấu/Cám Gạo', source: 'HTX Lúa Gạo Đồng Tháp', co2Factor: 1.5 },
  { id: 'mat_2', name: 'Bã Cà Phê', source: 'Chuỗi Cafe Trung Nguyên', co2Factor: 2.2 },
  { id: 'mat_3', name: 'Vỏ Chai Nhựa (rPET)', source: 'Đơn vị thu gom EcoShipper', co2Factor: 3.0 },
  { id: 'mat_4', name: 'Vải Vụn/Sợi Thừa', source: 'Xưởng May Mặc Việt Tiến', co2Factor: 4.5 },
];

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<BusinessProduct[]>([
    {
      id: 'prod_demo_1',
      name: 'Vớ từ bã cà phê khử mùi',
      price: 85000,
      greenMaterialId: 'mat_2',
      materialWeight: 0.2,
      co2Saved: 0.44,
      tokenGenerated: 0.44,
      status: 'pending_verification', // Đổi sang pending để demo duyệt
      sales: 1250, // Số liệu đẹp để demo pool lớn
      lockedRevenue: 10625000 // ~10 triệu VND đang bị khóa
    },
    {
      id: 'prod_demo_fail',
      name: 'Ống hút cỏ bàng (Lô 2)',
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

  // AI SIMULATOR: Công thức tính toán
  const calculateImpact = (materialId: string, weight: number) => {
    const material = MOCK_MATERIALS.find(m => m.id === materialId);
    if (!material) return { co2: 0, tokens: 0 };

    // Logic: CO2 giảm = Trọng lượng * Hệ số
    const co2 = parseFloat((weight * material.co2Factor).toFixed(2));
    
    // Logic: 1kg CO2 = 1 ECO Token (Z Token)
    const tokens = co2; 

    return { co2, tokens };
  };

  const addProduct = (newProduct: BusinessProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  // Giả lập bán hàng: Tăng doanh thu Locked
  const simulateSale = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        // Giả sử mỗi lần bán 1 cái, khóa 10% giá trị vào pool
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

  // LOGIC SMART CONTRACT: VERIFY (Task 4)
  const verifyProduct = (productId: string, isPassed: boolean, reason?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        if (isPassed) {
          // PASS: Unlock tiền cho DN (Trừ 1% phí sàn)
          const platformFee = p.lockedRevenue * 0.01;
          const netRevenue = p.lockedRevenue - platformFee;
          console.log(`[SmartContract] Unlocked ${netRevenue} VND to Business Wallet. Fee: ${platformFee}`);
          
          return { ...p, status: 'verified_pass', verificationDate: new Date(), verifierName: 'VinaControl' };
        } else {
          // FAIL: Refund 90% cho Consumer, Sàn lấy 10%
          const refundAmount = p.lockedRevenue * 0.9;
          const penaltyFee = p.lockedRevenue * 0.1;
          console.log(`[SmartContract] Refunded ${refundAmount} VND to Consumers. Penalty: ${penaltyFee}`);

          return { ...p, status: 'verified_fail', verificationDate: new Date(), verifierName: 'VinaControl', failReason: reason || "Gian lận số liệu CO2" };
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