import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

// Contexts
import { WalletContextProvider } from "@/contexts/WalletContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { GreenFundProvider } from "@/contexts/GreenFundContext"; // Import Context Quỹ Xanh

// Components & Pages
import ProtectedRoute from "@/components/ProtectedRoute";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryProducts from "./pages/CategoryProducts";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import EcoProfile from "./pages/EcoProfile";
import EcoVault from "./pages/EcoVault";
import About from "./pages/About";
import ShipperDashboard from "./pages/ShipperDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminVerification from "./pages/AdminVerification";
import GreenPool from "./pages/GreenPool"; // Import trang Green Pool
import StrategicModel from "./pages/StrategicModel"; // Import trang Strategy

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider autoConnect={false}>
        
        {/* --- ROUTER BAO BỌC TOÀN BỘ ỨNG DỤNG --- */}
        <BrowserRouter>
          
          <AuthProvider>
            <WalletContextProvider>
              
              {/* Business Context quản lý sản phẩm doanh nghiệp */}
              <BusinessProvider>
                
                {/* Green Fund Context quản lý quỹ tài trợ & vĩ mô */}
                <GreenFundProvider>
                  
                  <CartProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      
                      {showSplash ? (
                        <SplashScreen onFinish={() => setShowSplash(false)} />
                      ) : (
                        <Routes>
                          {/* --- PUBLIC ROUTES (Ai cũng xem được) --- */}
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/category/:categoryId" element={<CategoryProducts />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          
                          {/* Các trang chiến lược & quỹ (Public để Investor xem) */}
                          <Route path="/green-pool" element={<GreenPool />} />
                          <Route path="/strategy" element={<StrategicModel />} />

                          {/* --- PROTECTED ROUTES (Cần đăng nhập ví/tài khoản) --- */}
                          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                          <Route path="/eco-profile" element={<ProtectedRoute><EcoProfile /></ProtectedRoute>} />
                          <Route path="/eco-vault" element={<ProtectedRoute><EcoVault /></ProtectedRoute>} />

                          {/* --- ROLE-BASED ROUTES (Dành cho các vai trò đặc biệt) --- */}
                          <Route path="/shipper" element={<ShipperDashboard />} />
                          <Route path="/business" element={<BusinessDashboard />} />
                          <Route path="/verification" element={<AdminVerification />} />

                          {/* Catch-all: Trang 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      )}
                    </TooltipProvider>
                  </CartProvider>
                  
                </GreenFundProvider>
                
              </BusinessProvider>
            </WalletContextProvider>
          </AuthProvider>
          
        </BrowserRouter>
        
      </WalletProvider>
    </QueryClientProvider>
  );
};

// --- DÒNG QUAN TRỌNG ĐỂ SỬA LỖI MÀN HÌNH TRẮNG ---
export default App;