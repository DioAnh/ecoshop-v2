import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf, Coins, Info, ShieldCheck, Lock, TrendingUp, AlertCircle, BarChart3, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useWalletContext } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

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
  const { stakeEco } = useWalletContext();
  
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

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };
  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.selling_price || 0, originalPrice: product.original_price, image: product.image_url });
    toast({ title: "Position Added", description: `You are preparing to mint: ${product.name}` });
  };

  // Logic ReFi
  const ecoReward = Math.min(product.co2_emission || 0, 50); 
  const greenPremium = ecoReward * 1000;
  const apy = 12.5; // Hardcode demo APY

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 hover:bg-gray-100"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Market</Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT COLUMN: VISUAL */}
          <div className="space-y-6">
            <div className="relative group overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <img src={product.image_url} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-gray-800">
                <ScanLine className="w-3 h-3 text-blue-600" /> Digital Twin Ready
              </div>
              <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Leaf className="w-3 h-3" /> {product.co2_emission}kg CO₂ Verified
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Audit Passed</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Lock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Liquidity Locked</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase">High Yield</p>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FINANCIAL DATA */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">ReFi Asset #8821</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
              
              {/* PRICE CARD */}
              <Card className="border-2 border-emerald-100 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                <CardContent className="p-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Entry Price</p>
                            <div className="text-4xl font-extrabold text-gray-900">₫{product.selling_price.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 font-medium">Projected Yield</p>
                            <div className="text-2xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                                <TrendingUp className="w-5 h-5" /> {apy}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-dashed border-emerald-200 flex items-start gap-3">
                        <Coins className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-gray-800">Includes {ecoReward} ECO Token Seed</p>
                            <p className="text-xs text-gray-500">
                                This purchase automatically stakes <strong>{greenPremium.toLocaleString()} VND</strong> value into the Green Pool.
                            </p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleAddToCart} variant="outline" className="h-14 text-lg border-2 border-gray-200 hover:border-gray-900">
                Add to Portfolio
              </Button>
              <Button onClick={handleBuyNow} className="h-14 text-lg bg-gray-900 hover:bg-emerald-600 shadow-xl transition-all">
                Invest Now
              </Button>
            </div>

            {/* MICRO-INVESTMENT UPSELL */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-purple-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" /> Boost your Yield?
                    </h3>
                    <Badge className="bg-white text-purple-700 hover:bg-white border border-purple-200">+5% Bonus APY</Badge>
                </div>
                <p className="text-sm text-purple-700/80 mb-4">
                    Stake additional ECO tokens into this product's supply chain vault to become a <strong>Lead Investor</strong>.
                </p>
                <Button 
                    onClick={() => {
                        stakeEco(100, 'product', `Boost: ${product.name}`, 15, '6 Months');
                        toast({ title: "Staking Successful", description: "You are now earning compound interest.", className: "bg-purple-600 text-white" });
                    }} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                    Stake 100 ECO
                </Button>
            </div>

            {/* Description Accordion (Simplified) */}
            <div className="text-sm text-gray-500 leading-relaxed border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-2">Asset Details</h4>
                <p>{product.descripton}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;