import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Leaf, Lock, ArrowUpRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  selling_price: number | null; // Cho phép null để tránh lỗi type
  image_url: string;
  co2_emission: number;
  category: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <Badge className="mb-2 bg-purple-100 text-purple-700">Primary Market</Badge>
            <h1 className="text-3xl font-extrabold text-gray-900">Green Asset Market</h1>
            <p className="text-gray-500">Mint positions. Earn Yield.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search assets..." className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto text-emerald-600" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              // Safe check for null values
              const co2 = product.co2_emission || 0;
              const price = product.selling_price || 0; 
              const apy = (10 + co2).toFixed(1);

              return (
                <Card key={product.id} className="group hover:border-emerald-500 cursor-pointer transition-all flex flex-col h-full" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-xl">
                    <img 
                      src={product.image_url || "/placeholder.svg"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.name}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-emerald-700 flex gap-1">
                      <TrendingUp className="w-3 h-3" /> {apy}% APY
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600">{product.name}</h3>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-grow">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-400">Price</p>
                        {/* --- DÒNG ĐÃ FIX LỖI --- */}
                        <span className="font-bold">{price.toLocaleString()} ₫</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">Lock</p>
                        <span className="text-xs font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> 30 Days</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-gray-50 text-gray-900 hover:bg-emerald-600 hover:text-white border border-gray-200 h-9 text-xs group/btn">
                      Mint Position <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover/btn:opacity-100" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
export default Products;