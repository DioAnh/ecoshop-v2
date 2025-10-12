import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  selling_price: number;
  original_price?: number;
  image_url: string;
  co2_emission: number;
  descripton: string; // Note: this is the actual field name in DB (typo)
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

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(id || '0'))
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted h-8 w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted h-96 lg:h-[500px] rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-muted h-8 w-3/4"></div>
                <div className="bg-muted h-4 w-1/2"></div>
                <div className="bg-muted h-6 w-1/3"></div>
                <div className="bg-muted h-20 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const getCO2BadgeClass = (emission: number) => {
    if (emission < 1) return "co2-low";
    if (emission < 3) return "co2-medium";
    return "co2-high";
  };

  const handleBuyNow = () => {
    const price = product.selling_price || product.original_price || 0;
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: product.original_price,
      image: product.image_url
    });
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    const price = product.selling_price || product.original_price || 0;
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: product.original_price,
      image: product.image_url
    });
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  const displayPrice = product.selling_price || product.original_price || 0;
  const hasDiscount = product.selling_price && product.original_price && product.selling_price < product.original_price;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang chủ
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
            />
            {product.co2_emission && (
              <div className="absolute top-4 left-4">
                <div className={`co2-badge ${getCO2BadgeClass(product.co2_emission)}`}>
                  <Leaf className="w-3 h-3" />
                  {product.co2_emission}kg CO₂e
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-eco-light text-eco-dark">
                  Eco-Friendly
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">₫{displayPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₫{product.original_price?.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>⭐ 4.5</span>
                <span>•</span>
                <span>Sản phẩm eco-friendly</span>
              </div>
            </div>

            {/* Description */}
            {product.descripton && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Mô tả sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.descripton}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product["Thành phần"] && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Thành phần sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product["Thành phần"]}
                </p>
              </div>
            )}

            {/* Story */}
            {product["Câu chuyện"] && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Câu chuyện sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product["Câu chuyện"]}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                variant="outline" 
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;