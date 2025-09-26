import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  selling_price: number;
  original_price?: number;
  image_url: string;
  co2_emission: number;
  category: number;
  descripton: string;
  point: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      const { data: categoryData, error: categoryError } = await (supabase as any)
        .from('category')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Fetch products in this category
      const { data: productsData, error: productsError } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('category', categoryId)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải sản phẩm...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button and Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Về trang chủ
          </button>
        </div>

        {/* Category Header */}
        {category && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            </div>
            <p className="text-muted-foreground">
              Tìm thấy {products.length} sản phẩm trong danh mục này
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.selling_price}
                originalPrice={product.original_price}
                image={product.image_url}
                co2Emission={product.co2_emission || 0}
                certification={["Eco"]}
                rating={4.5}
                sold={Math.floor(Math.random() * 500) + 50}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Chưa có sản phẩm
            </h3>
            <p className="text-muted-foreground">
              Danh mục này hiện chưa có sản phẩm nào.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryProducts;