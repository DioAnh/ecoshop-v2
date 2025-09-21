import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import organicFoodImage from "@/assets/organic-food.jpg";
import homeProductsImage from "@/assets/home-products.jpg";
import recycledFashionImage from "@/assets/recycled-fashion.jpg";
import qrCodeImage from "@/assets/qr-code-placeholder.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock product data (in real app, this would come from API/database)
  const products = {
    "1": {
      id: "1",
      name: "Combo rau củ organic tươi từ Đà Lạt - Gói 2kg",
      price: 125000,
      originalPrice: 150000,
      image: organicFoodImage,
      co2Emission: 0.8,
      certification: ["Organic", "VietGAP"],
      rating: 4.8,
      sold: 234,
      description: "Combo rau củ organic tươi ngon từ nông trại Đà Lạt, được trồng hoàn toàn tự nhiên không sử dụng thuốc trừ sâu hay phân bón hóa học. Gói 2kg bao gồm: cà rót, cà chua, rau muống, xà lách, cải thảo. Sản phẩm được chứng nhận Organic quốc tế và VietGAP, đảm bảo an toàn tuyệt đối cho sức khỏe gia đình bạn."
    },
    "2": {
      id: "2", 
      name: "Bộ đồ dùng bếp tre tự nhiên 100% - Set 5 món",
      price: 89000,
      originalPrice: 120000,
      image: homeProductsImage,
      co2Emission: 1.2,
      certification: ["FSC", "Eco"],
      rating: 4.9,
      sold: 156,
      description: "Bộ đồ dùng bếp làm từ tre tự nhiên 100%, thân thiện với môi trường. Set gồm 5 món: thớt, muỗng múc cơm, đũa, muỗng canh, và thìa ăn. Tre được chọn lọc kỹ càng, qua xử lý đặc biệt để chống nấm mốc và kháng khuẩn tự nhiên. Có chứng nhận FSC về nguồn gốc bền vững."
    },
    "3": {
      id: "3",
      name: "Áo thun cotton organic unisex - Màu xanh lá",
      price: 199000,
      originalPrice: 250000,
      image: recycledFashionImage,
      co2Emission: 2.1,
      certification: ["GOTS", "Organic"],
      rating: 4.7,
      sold: 89,
      description: "Áo thun unisex được làm từ 100% cotton organic, mềm mại và thoáng mát. Chất liệu cotton được trồng không sử dụng thuốc trừ sâu, an toàn cho da. Thiết kế đơn giản, phù hợp cho cả nam và nữ. Có chứng nhận GOTS (Global Organic Textile Standard) đảm bảo quy trình sản xuất bền vững."
    }
  };

  const product = products[id as keyof typeof products];

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
    setShowPaymentModal(true);
  };

  const handleAddToCart = () => {
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  const greenPointsEarned = Math.floor(product.price / 1000);
  const co2Saved = product.co2Emission;

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
              src={product.image} 
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <div className={`co2-badge ${getCO2BadgeClass(product.co2Emission)}`}>
                <Leaf className="w-3 h-3" />
                {product.co2Emission}kg CO₂e
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                {product.certification.map((cert) => (
                  <Badge key={cert} variant="secondary" className="bg-eco-light text-eco-dark">
                    {cert}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">₫{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₫{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>⭐ {product.rating}</span>
                <span>•</span>
                <span>Đã bán {product.sold}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Thanh toán QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <img 
              src={qrCodeImage} 
              alt="QR Code thanh toán" 
              className="w-48 h-48 object-contain border border-border rounded-lg"
            />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">
                Quét mã QR để thanh toán
              </p>
              <p className="text-2xl font-bold text-primary">
                ₫{product.price.toLocaleString()}
              </p>
            </div>
            <div className="bg-eco-light/30 p-4 rounded-lg text-center max-w-sm">
              <p className="text-eco-dark font-medium mb-2">
                🌱 Cảm ơn bạn đã mua hàng xanh!
              </p>
              <p className="text-sm text-muted-foreground">
                Bạn đã tiết kiệm được <span className="font-bold text-eco-dark">{co2Saved}kg CO₂e</span> và 
                nhận <span className="font-bold text-primary">{greenPointsEarned} GreenPoint</span>.
              </p>
            </div>
            <Button 
              onClick={() => setShowPaymentModal(false)}
              variant="outline"
              className="w-full"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;