import { ShoppingCart, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import certFairtrade from "@/assets/cert-fairtrade.jpg";
import certFSC from "@/assets/cert-fsc.jpg";
import certOrganic from "@/assets/cert-organic.jpg";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  co2Emission: number;
  certification: string[];
  rating: number;
  sold: number;
  categoryName?: string;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  co2Emission, 
  certification, 
  rating, 
  sold,
  categoryName
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const organicCategories = ["Thời trang", "Thực phẩm", "Làm đẹp", "Chăm sóc sức khỏe"];
  const showOrganicCert = categoryName && organicCategories.some(cat => 
    categoryName.toLowerCase().includes(cat.toLowerCase())
  );
  
  // Logic màu sắc cho CO2 Badge
  const getCO2BadgeStyle = (emission: number) => {
    if (emission < 1) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (emission < 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: typeof id === 'string' ? parseInt(id) : id,
      name,
      price,
      originalPrice,
      image
    });
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${name} đã được thêm vào giỏ hàng.`,
      className: "bg-green-50 border-green-200"
    });
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer" 
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* 1. IMAGE SECTION */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* CO2 Badge - Glassmorphism Style */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border backdrop-blur-md bg-white/90 ${getCO2BadgeStyle(co2Emission)}`}>
            <Leaf className="w-3 h-3" />
            <span>{co2Emission}kg CO₂e</span>
          </div>
        </div>

        {/* Cert Badges - Fix lỗi màu trắng trên nền trắng */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {certification.map((cert) => (
            <Badge 
              key={cert} 
              variant="secondary" 
              className="text-[10px] px-2 py-0.5 bg-green-100 hover:bg-green-200 text-green-800 border-none shadow-sm"
            >
              {cert}
            </Badge>
          ))}
        </div>

        {/* Small Cert Logos at bottom */}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
           <img src={certFairtrade} className="w-6 h-6 bg-white rounded shadow-sm p-0.5" />
           <img src={certFSC} className="w-6 h-6 bg-white rounded shadow-sm p-0.5" />
           {showOrganicCert && <img src={certOrganic} className="w-6 h-6 bg-white rounded shadow-sm p-0.5" />}
        </div>
      </div>

      {/* 2. CONTENT SECTION - Fix Padding & Spacing */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug text-gray-700 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Price Area */}
        <div className="flex items-end gap-2">
          <span className="text-lg font-extrabold text-primary">
            ₫{(price || 0).toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through mb-1">
              ₫{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-gray-100 pt-2 mt-auto">
          <div className="flex items-center gap-1 text-yellow-500 font-medium">
             <span>⭐ {rating}</span>
          </div>
          <span>Đã bán {sold}</span>
        </div>

        {/* 3. BUTTONS - Micro Interactions */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <Button 
            size="sm" 
            className="col-span-3 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
            onClick={handleAddToCart}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm vào giỏ
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="col-span-1 rounded-lg bg-secondary/50 hover:bg-secondary text-primary transition-all active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;