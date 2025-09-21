import { Apple, Home, Shirt, Package, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import organicFoodImage from "@/assets/organic-food.jpg";
import homeProductsImage from "@/assets/home-products.jpg";
import recycledFashionImage from "@/assets/recycled-fashion.jpg";

const Homepage = () => {
  const categories = [
    {
      title: "Thực phẩm organic",
      icon: Apple,
      image: organicFoodImage,
      description: "Thực phẩm sạch, không hóa chất",
      itemCount: 1234
    },
    {
      title: "Đồ gia dụng xanh",
      icon: Home,
      image: homeProductsImage,
      description: "Tiện ích bền vững cho gia đình",
      itemCount: 856
    },
    {
      title: "Thời trang tái chế",
      icon: Shirt,
      image: recycledFashionImage,
      description: "Quần áo từ vật liệu tái chế",
      itemCount: 642
    },
    {
      title: "Bao bì sinh học",
      icon: Package,
      image: organicFoodImage,
      description: "Bao bì phân hủy sinh học",
      itemCount: 389
    },
    {
      title: "Tiết kiệm năng lượng",
      icon: Zap,
      image: homeProductsImage,
      description: "Thiết bị hiệu quả năng lượng",
      itemCount: 567
    }
  ];

  const featuredProducts = [
    {
      id: "1",
      name: "Combo rau củ organic tươi từ Đà Lạt - Gói 2kg",
      price: 125000,
      originalPrice: 150000,
      image: organicFoodImage,
      co2Emission: 0.8,
      certification: ["Organic", "VietGAP"],
      rating: 4.8,
      sold: 234
    },
    {
      id: "2",
      name: "Bộ đồ dùng bếp tre tự nhiên 100% - Set 5 món",
      price: 89000,
      originalPrice: 120000,
      image: homeProductsImage,
      co2Emission: 1.2,
      certification: ["FSC", "Eco"],
      rating: 4.9,
      sold: 156
    },
    {
      id: "3",
      name: "Áo thun cotton organic unisex - Màu xanh lá",
      price: 199000,
      image: recycledFashionImage,
      co2Emission: 2.1,
      certification: ["GOTS", "Organic"],
      rating: 4.7,
      sold: 89
    },
    {
      id: "4",
      name: "Bình nước thủy tinh tái chế - 500ml",
      price: 65000,
      originalPrice: 85000,
      image: homeProductsImage,
      co2Emission: 0.5,
      certification: ["Recycled"],
      rating: 4.6,
      sold: 312
    },
    {
      id: "5",
      name: "Túi vải canvas organic tái sử dụng",
      price: 45000,
      image: recycledFashionImage,
      co2Emission: 0.3,
      certification: ["Organic", "Reusable"],
      rating: 4.9,
      sold: 445
    },
    {
      id: "6",
      name: "Nước rửa chén sinh học không hóa chất",
      price: 35000,
      originalPrice: 42000,
      image: homeProductsImage,
      co2Emission: 0.6,
      certification: ["Bio", "Non-toxic"],
      rating: 4.5,
      sold: 678
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <HeroBanner />
        
        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Danh mục sản phẩm</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Sản phẩm nổi bật</h2>
            <button className="text-primary hover:text-primary-hover font-medium">
              Xem tất cả →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-eco-light/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Tác động tích cực của cộng đồng EcoShop
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,234</div>
              <div className="text-muted-foreground">Tấn CO₂ đã tiết kiệm</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,456</div>
              <div className="text-muted-foreground">Khách hàng xanh</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,789</div>
              <div className="text-muted-foreground">Sản phẩm bán ra</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">EcoShop - Mua sắm xanh, sống bền vững</p>
            <p className="text-primary-foreground/80">
              © 2024 EcoShop. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;