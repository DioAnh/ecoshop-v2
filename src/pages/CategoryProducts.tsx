import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Filter } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
    if (categoryId) { fetchCategoryAndProducts(); }
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      // Fetch category details
      const { data: categoryData } = await (supabase as any).from('category').select('*').eq('id', categoryId).single();
      setCategory(categoryData);
      // Fetch products
      const { data: productsData } = await (supabase as any).from('products').select('*').eq('category', categoryId).order('created_at', { ascending: false });
      setProducts(productsData || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
           <p className="text-muted-foreground animate-pulse">Searching for green products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      {/* Category Header Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                   {category?.name || "Category"}
                   <span className="text-sm font-normal bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-500 shadow-sm">
                      {products.length} products
                   </span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                   Discover eco-friendly {category?.name.toLowerCase()} products to help you live greener every day.
                </p>
             </div>
             
             {/* Filter Button (Mock UI) */}
             <Button variant="outline" className="bg-white border-gray-200 shadow-sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                categoryName={category?.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">This category is being updated.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryProducts;