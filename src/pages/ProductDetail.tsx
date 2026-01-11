import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf, Coins, Info, ShieldCheck, Lock, TrendingUp, AlertCircle } from "lucide-react";
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
  selling_price: number;
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

  // --- 1. KIỂM TRA LOADING TRƯỚC (ĐỂ TRÁNH LỖI MÀN HÌNH TRẮNG) ---
  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center">Đang tải dữ liệu...</div></div>;
  if (!product) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-20 text-center">Sản phẩm không tồn tại</div></div>;

  // --- 2. TÍNH TOÁN DỮ LIỆU (CHỈ CHẠY KHI ĐÃ CÓ PRODUCT) ---
  const getCO2BadgeClass = (emission: number) => emission < 1 ? "co2-low" : emission < 3 ? "co2-medium" : "co2-high";
  
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };
  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.selling_price || 0, originalPrice: product.original_price, image: product.image_url });
    toast({ title: "Đã thêm vào giỏ hàng", description: `${product.name} đã thêm.` });
  };

  const ecoShopPrice = product.selling_price || 0;
  // Cap Max 50 ECO
  const rawReward = product.co2_emission || 0;
  const ecoReward = Math.min(rawReward, 50); 
  const greenPremium = ecoReward * 1000;
  const marketPrice = ecoShopPrice - greenPremium;

  // Mock trạng thái Pool cho sản phẩm (Task 4)
  const poolSize = (product.selling_price * 1250 * 0.1).toLocaleString(); 

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

              {/* PRICE SECTION */}
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

            {/* FINANCIAL TRANSPARENCY CARD (Task 4) */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" /> Minh bạch dòng tiền & Tác động
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Locked Pool */}
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Locked Pool</span>
                    <Lock className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{poolSize} ₫</p>
                  <p className="text-xs text-gray-500 mt-1">10% doanh thu bị khóa để đảm bảo cam kết xanh.</p>
                </div>

                {/* Card 2: Consumer Protection */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Bảo vệ người mua</span>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">Hoàn tiền 90%</p>
                  <p className="text-xs text-gray-500 mt-1">Nếu dự án gian lận hoặc không đạt kiểm định CO2.</p>
                </div>

                {/* Card 3: Impact */}
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Tác động thực</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product.co2_emission} kg CO₂ / sp</p>
                  <p className="text-xs text-gray-500 mt-1">Dữ liệu được kiểm toán on-chain bởi VinaControl.</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg flex gap-3 items-center text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>Khi bạn mua sản phẩm này, bạn không chỉ là người tiêu dùng mà còn là <strong>nhà đầu tư vi mô</strong>. Nếu dự án thành công, Token ECO bạn nhận được sẽ có giá trị cao hơn nhờ hệ sinh thái phát triển.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;