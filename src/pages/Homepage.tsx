import { useEffect, useState } from "react";
import { Apple, Home, Shirt, Package, Zap, TrendingUp, ArrowRight, Leaf } from "lucide-react";
import { useWallet } from '@suiet/wallet-kit';
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
// Loại bỏ HeroBanner cũ, ta sẽ code trực tiếp để đẹp hơn
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button"; 
import organicFoodImage from "@/assets/organic-food.jpg";
import homeProductsImage from "@/assets/home-products.jpg";
import recycledFashionImage from "@/assets/recycled-fashion.jpg";

// ... (Giữ nguyên Interface Product và Category như cũ)
interface Product {
  id: string;
  name: string;
  selling_price: number;
  original_price?: number;
  image_url: string;
  co2_emission: number;
  category: number;
  descripton: string;
  is_hot?: boolean;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
  image?: string;
  productCount: number;
}

const Homepage = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ... (Giữ nguyên logic fetchProducts, fetchCategories, getCategoryIcon, getCategoryImage)
  // COPY LẠI ĐOẠN LOGIC FETCH DATA TỪ FILE CŨ CỦA BẠN VÀO ĐÂY
  // (Tôi rút gọn đoạn này để tập trung vào phần UI bên dưới)
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*, category(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const productsWithCategory = (data || []).map((product: any) => ({
        ...product,
        category_name: product.category?.name
      }));
      setProducts(productsWithCategory);
    } catch (error) { console.error(error); } finally { setLoadingProducts(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await (supabase as any).from('category').select('*').order('name', { ascending: true });
      if (error) throw error;
      const categoriesWithCount = await Promise.all((data || []).map(async (cat: any) => {
        const { count } = await (supabase as any).from('products').select('*', { count: 'exact', head: true }).eq('category', cat.id);
        return { ...cat, productCount: count || 0 };
      }));
      setCategories(categoriesWithCount);
    } catch (error) { console.error(error); } finally { setLoadingCategories(false); }
  };

  const getCategoryIcon = (index: number) => {
    const icons = [Apple, Home, Shirt, Package, Zap];
    return icons[index % icons.length];
  };

  const getCategoryImage = (index: number) => {
    const images = [organicFoodImage, homeProductsImage, recycledFashionImage];
    return images[index % images.length];
  };

  // Mock featured products (giữ nguyên để backup)
  const featuredProducts = [
    { id: "1", name: "Combo rau củ organic tươi từ Đà Lạt", price: 125000, originalPrice: 150000, image: organicFoodImage, co2Emission: 0.8, certification: ["Organic", "VietGAP"], rating: 4.8, sold: 234 },
    { id: "2", name: "Bộ đồ dùng bếp tre tự nhiên 100%", price: 89000, originalPrice: 120000, image: homeProductsImage, co2Emission: 1.2, certification: ["FSC", "Eco"], rating: 4.9, sold: 156 },
    { id: "3", name: "Áo thun cotton organic unisex", price: 199000, image: recycledFashionImage, co2Emission: 2.1, certification: ["GOTS"], rating: 4.7, sold: 89 },
    { id: "4", name: "Bình nước thủy tinh tái chế 500ml", price: 65000, originalPrice: 85000, image: homeProductsImage, co2Emission: 0.5, certification: ["Recycled"], rating: 4.6, sold: 312 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-16">
        
        {/* 1. NEW HERO BANNER - Fix Text Contrast & Animations */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2813&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/70 to-transparent"></div>
          </div>

          <div className="relative z-10 py-16 px-8 md:py-24 md:px-16 max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-sm font-medium mb-6 animate-in slide-in-from-left duration-700 delay-100">
               <Leaf className="w-4 h-4" /> Mua sắm bền vững
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-in slide-in-from-bottom duration-700 delay-200">
               Mua sắm xanh <br/>
               <span className="text-emerald-300">Giảm phát thải CO₂</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl leading-relaxed animate-in slide-in-from-bottom duration-700 delay-300">
               Khám phá hàng ngàn sản phẩm thân thiện môi trường. Mỗi lần mua sắm là một lần bạn tích lũy ECO Token và bảo vệ hành tinh.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom duration-700 delay-400">
               <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                  Khám phá ngay <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
               <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8">
                  Tìm hiểu thêm
               </Button>
            </div>
          </div>
        </section>
        
        {/* 2. CATEGORIES */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="w-6 h-6 text-primary" /></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Danh mục sản phẩm</h2>
          </div>
          
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-200 h-40 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  icon={getCategoryIcon(index)}
                  image={category.image || getCategoryImage(index)}
                  description={`${category.productCount} sản phẩm`}
                  itemCount={category.productCount}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. FEATURED PRODUCTS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">Xem tất cả &rarr;</Button>
          </div>
          
          {loadingProducts ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 h-80 rounded-2xl animate-pulse"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.filter(p => p.is_hot).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.selling_price || 0}
                  originalPrice={product.original_price}
                  image={product.image_url}
                  co2Emission={product.co2_emission || 0}
                  certification={["Eco", "Green"]}
                  rating={4.8}
                  sold={Math.floor(Math.random() * 200) + 10}
                  categoryName={product.category_name}
                />
              ))}
              {/* Fallback nếu không có sản phẩm hot */}
              {products.filter(p => p.is_hot).length === 0 && featuredProducts.map((product) => (
                 <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </section>

        {/* 4. STATS SECTION */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 md:p-16 text-center border border-emerald-100">
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-10">
            Tác động tích cực của cộng đồng EcoShop
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-emerald-50">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">1,234</div>
              <div className="text-gray-600 font-medium">Tấn CO₂ đã tiết kiệm</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-emerald-50">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">10k+</div>
              <div className="text-gray-600 font-medium">Khách hàng tin dùng</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-emerald-50">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">50k+</div>
              <div className="text-gray-600 font-medium">Sản phẩm bán ra</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Leaf className="w-6 h-6 text-primary" />
             <span className="text-xl font-bold text-gray-800">EcoShop</span>
          </div>
          <p className="text-gray-500 mb-6">Nền tảng thương mại điện tử Shop-to-Earn trên Sui Blockchain</p>
          <p className="text-gray-400 text-sm">© 2024 EcoShop. Powered by Sui Network.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;