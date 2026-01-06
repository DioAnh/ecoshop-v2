import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf, Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
  id: number;
  name: string;
  selling_price: number; // Giá EcoShop (Cao)
  original_price?: number; 
  image_url: string;
  co2_emission: number;
  descripton: string;
  "Thành phần"?: string;
  "Câu chuyện"?: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', parseInt(id || '0')).single();
      if (error) throw error;
      setProduct(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center">Loading...</div></div>;
  if (!product) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center">Product not found</div></div>;

  const getCO2BadgeClass = (emission: number) => emission < 1 ? "co2-low" : emission < 3 ? "co2-medium" : "co2-high";
  
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };
  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.selling_price || 0, originalPrice: product.original_price, image: product.image_url });
    toast({ title: "Đã thêm vào giỏ hàng", description: `${product.name} đã thêm.` });
  };

  // --- LOGIC GREEN PREMIUM & CAP 50 ECO ---
  const ecoShopPrice = product.selling_price || 0;
  
  // Tính Reward dựa trên CO2, nhưng Cap ở 50 ECO
  const rawReward = product.co2_emission || 0;
  const ecoReward = Math.min(rawReward, 50); // Cap Max 50 ECO
  
  // Tính Green Premium (tiền chênh lệch)
  const greenPremium = ecoReward * 1000;
  
  // Tính giá thị trường (Giả định để hiển thị)
  const marketPrice = ecoShopPrice - greenPremium;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ</Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img src={product.image_url} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-sm" />
            {product.co2_emission && (<div className="absolute top-4 left-4"><div className={`co2-badge ${getCO2BadgeClass(product.co2_emission)}`}><Leaf className="w-3 h-3" /> {product.co2_emission}kg CO₂e</div></div>)}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4"><Badge variant="secondary" className="bg-green-100 text-green-800">Eco-Friendly</Badge></div>

              {/* PRICE SECTION: ECO PRICE VS MARKET PRICE */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex flex-col mb-3">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-primary">₫{ecoShopPrice.toLocaleString()}</span>
                    <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-2 rounded">Giá EcoShop</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg text-gray-400 line-through">₫{marketPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">(Giá thị trường)</span>
                  </div>
                </div>
                
                {/* Green Premium Explanation */}
                <div className="flex gap-2 items-start text-xs text-gray-500 bg-white p-3 rounded-lg border border-dashed border-gray-200">
                   <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                   <div>
                      <p className="mb-1"><strong>Tại sao giá cao hơn?</strong> Bạn đang trả thêm <strong>Green Premium</strong> ({greenPremium.toLocaleString()}đ) để bù đắp carbon.</p>
                      <p>Khoản chênh lệch này được hoàn lại thành <strong className="text-emerald-600">{ecoReward} ECO</strong> (≈ {greenPremium.toLocaleString()} VND) vào ví của bạn.</p>
                   </div>
                </div>
              </div>

              {/* TOKEN REWARD */}
              {ecoReward > 0 && (
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm w-full">
                  <div className="p-2 bg-white rounded-full shadow-sm"><Coins className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Quyền lợi Web3</span>
                    <span className="text-sm text-emerald-900 font-medium">Mua ngay nhận: <span className="font-bold text-lg text-emerald-600">+{ecoReward} ECO</span></span>
                  </div>
                </div>
              )}
            </div>

            {product.descripton && (<div><h3 className="text-lg font-semibold text-foreground mb-2">Mô tả</h3><p className="text-muted-foreground leading-relaxed">{product.descripton}</p></div>)}
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handleAddToCart} variant="outline" className="flex-1 h-12 text-base"><Plus className="w-4 h-4 mr-2" /> Thêm vào giỏ</Button>
              <Button onClick={handleBuyNow} className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20"><ShoppingCart className="w-4 h-4 mr-2" /> Mua ngay</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;