import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf, Coins, Info, ShieldCheck, Lock, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useWalletContext } from "@/contexts/WalletContext"; // Import mới
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  selling_price: number;
  original_price?: number;
  image_url: string;
  co2_emission: number;
  descripton: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { stakeEco } = useWalletContext(); // Lấy hàm stake từ WalletContext
  
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
    toast({ title: "Added to cart", description: `${product.name} added.` });
  };

  // MỚI: Hàm xử lý đầu tư nhanh (Micro-investment)
  const handleQuickInvest = () => {
    // Demo: Stake 100 ECO vào sản phẩm này với APR 15%
    stakeEco(100, 'product', `Invest: ${product.name}`, 15, '6 Months'); 
    toast({ 
      title: "Investment Successful! 🚀", 
      description: "You have funded the green supply chain for this product.", 
      className: "bg-purple-50 border-purple-200" 
    });
  };

  const ecoShopPrice = product.selling_price || 0;
  const rawReward = product.co2_emission || 0;
  const ecoReward = Math.min(rawReward, 50); 
  const greenPremium = ecoReward * 1000;
  const marketPrice = ecoShopPrice - greenPremium;

  const poolSize = (product.selling_price * 1250 * 0.1).toLocaleString(); 

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img src={product.image_url} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-sm" />
            {product.co2_emission && (<div className="absolute top-4 left-4"><div className={`co2-badge ${getCO2BadgeClass(product.co2_emission)}`}><Leaf className="w-3 h-3" /> {product.co2_emission}kg CO₂e</div></div>)}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4"><Badge variant="secondary" className="bg-green-100 text-green-800">Eco-Friendly</Badge></div>

              <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex flex-col mb-3">
                  <div className="flex items-end gap-3"><span className="text-4xl font-extrabold text-primary">₫{ecoShopPrice.toLocaleString()}</span><span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-2 rounded">EcoShop Price</span></div>
                  <div className="flex items-center gap-2 mt-1"><span className="text-lg text-gray-400 line-through">₫{marketPrice.toLocaleString()}</span><span className="text-sm text-gray-500">(Market Price)</span></div>
                </div>
                <div className="flex gap-2 items-start text-xs text-gray-500 bg-white p-3 rounded-lg border border-dashed border-gray-200">
                   <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                   <div><p className="mb-1"><strong>Why higher?</strong> You pay a <strong>Green Premium</strong> ({greenPremium.toLocaleString()}đ) to offset carbon.</p><p>This is refunded as <strong className="text-emerald-600">{ecoReward} ECO</strong> (≈ {greenPremium.toLocaleString()} VND) to your wallet.</p></div>
                </div>
              </div>

              {ecoReward > 0 && (
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm w-full">
                  <div className="p-2 bg-white rounded-full shadow-sm"><Coins className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex flex-col"><span className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Web3 Benefits</span><span className="text-sm text-emerald-900 font-medium">Earn Instantly: <span className="font-bold text-lg text-emerald-600">+{ecoReward} ECO</span></span></div>
                </div>
              )}
            </div>

            {product.descripton && (<div><h3 className="text-lg font-semibold text-foreground mb-2">Description</h3><p className="text-muted-foreground leading-relaxed">{product.descripton}</p></div>)}
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handleAddToCart} variant="outline" className="flex-1 h-12 text-base"><Plus className="w-4 h-4 mr-2" /> Add to Cart</Button>
              <Button onClick={handleBuyNow} className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20"><ShoppingCart className="w-4 h-4 mr-2" /> Buy Now</Button>
            </div>

            {/* MỚI: SUPPLY CHAIN INVESTMENT (REFI) */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 bg-purple-50/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-700 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Fund Supply Chain (ReFi)</span>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">APR: 15%</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Become a micro-investor! Fund the business to source green materials for the next batch. Earn interest from the Green Pool.
              </p>
              <Button onClick={handleQuickInvest} variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold h-10">
                Invest 100 ECO
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-600" /> Financial Transparency & Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Locked Pool</span><Lock className="w-4 h-4 text-orange-500" /></div>
                  <p className="text-2xl font-bold text-gray-900">{poolSize} ₫</p><p className="text-xs text-gray-500 mt-1">10% revenue locked to ensure green commitment.</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Consumer Protection</span><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
                  <p className="text-lg font-bold text-gray-900">90% Refund</p><p className="text-xs text-gray-500 mt-1">If the project is fraudulent or fails verification.</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-green-700 uppercase tracking-wider">Real Impact</span><TrendingUp className="w-4 h-4 text-green-500" /></div>
                  <p className="text-lg font-bold text-gray-900">{product.co2_emission} kg CO₂ / unit</p><p className="text-xs text-gray-500 mt-1">Data verified on-chain by VinaControl.</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-100 rounded-lg flex gap-3 items-center text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>By buying this, you are not just a consumer but a <strong>micro-investor</strong>. If the project succeeds, your ECO Tokens will gain value as the ecosystem grows.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;