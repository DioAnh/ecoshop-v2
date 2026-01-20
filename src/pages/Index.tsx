import { useState, useEffect } from "react"; // Thêm hook
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { 
  ArrowRight, TrendingUp, Zap, ShieldCheck, 
  Leaf, Lock, ArrowUpRight, Loader2 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase

// Interface cho Product
interface Product {
  id: number;
  name: string;
  selling_price: number;
  image_url: string;
  co2_emission: number;
  category: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sản phẩm thực tế từ Supabase
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Lấy 4 sản phẩm mới nhất để hiển thị trang chủ
      const { data, error } = await supabase.from('products').select('*').limit(4);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm giả lập số liệu tài chính (ReFi Logic)
  const getProductMetrics = (co2: number) => {
    const apy = (10 + (co2 * 2)).toFixed(1);
    return { apy };
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl shadow-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sui Mainnet Live: Green Pool v2.7
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold text-gray-900 mb-8 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Stop Spending. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Start Investing.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The first <strong>ReFi Protocol</strong> on Sui that turns your daily consumption into <span className="text-gray-900 font-semibold underline decoration-emerald-400/50 decoration-4">Yield-Bearing Assets</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link to="/products">
              <Button size="lg" className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 rounded-full">
                Start Shopping
              </Button>
            </Link>
            <Link to="/strategy">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 rounded-full hover:bg-gray-50">
                Whitepaper v2.7
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURED VAULTS (Giữ nguyên phần này để tạo FOMO) --- */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50 mb-2">High Yield Opportunities</Badge>
              <h2 className="text-3xl font-bold text-gray-900">Featured Investment Vaults</h2>
            </div>
            <Link to="/green-pool" className="text-blue-600 font-bold flex items-center hover:underline">
              View All Vaults <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vault Card 1 */}
            <Card className="border border-gray-200 hover:border-emerald-500 transition-all cursor-pointer group bg-gradient-to-br from-white to-emerald-50/20">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl">🥛</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Vinamilk Organic Batch #88</h4>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mt-1">Audit Passed</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Target APY</p><p className="text-3xl font-extrabold text-emerald-600">12.5%</p></div>
                  <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase">Staked</p><p className="text-2xl font-bold text-gray-900">450K ECO</p></div>
                </div>
              </CardContent>
            </Card>
             {/* Vault Card 2 */}
             <Card className="border border-gray-200 hover:border-blue-500 transition-all cursor-pointer group bg-gradient-to-br from-white to-blue-50/20">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl">🌾</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">ST25 Rice Export</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 mt-1">Open</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Target APY</p><p className="text-3xl font-extrabold text-blue-600">8.2%</p></div>
                  <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase">Staked</p><p className="text-2xl font-bold text-gray-900">1.2M ECO</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: TRENDING GREEN ASSETS (SẢN PHẨM) --- */}
      {/* Đây là phần thay thế cho Homepage cũ, hiển thị sản phẩm thực tế */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Market Opportunities</h2>
            <p className="text-gray-500 mt-2">Buy products to mint positions. Earn ECO cashback instantly.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const metrics = getProductMetrics(product.co2_emission);
                return (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-emerald-400 cursor-pointer overflow-hidden flex flex-col h-full bg-white"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-emerald-700 shadow-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {metrics.apy}% Yield
                      </div>
                    </div>

                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{product.category}</p>
                    </CardHeader>

                    <CardContent className="p-4 pt-2 flex-grow">
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <p className="text-[10px] text-gray-400">Entry Price</p>
                          <span className="text-lg font-bold text-gray-900">{product.selling_price.toLocaleString()} ₫</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Cashback</p>
                          <span className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                            +{Math.min(product.co2_emission, 50)} ECO
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-gray-50 text-gray-900 hover:bg-emerald-600 hover:text-white border border-gray-200 hover:border-emerald-600 transition-all font-semibold h-9 text-sm group/btn">
                        Mint Position <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover/btn:opacity-100" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link to="/products">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-gray-300 text-gray-600 hover:text-emerald-600 hover:border-emerald-500">
                View All Assets Market
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to build your Green Portfolio?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of investors turning their shopping receipts into verifiable on-chain assets.</p>
          <Link to="/products">
            <Button size="lg" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-bold rounded-full">
              Go to Market
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Index;