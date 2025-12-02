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
  id: string;
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

  // Categories that should show organic certification
  const organicCategories = ["Thời trang", "Thực phẩm", "Làm đẹp", "Chăm sóc sức khỏe"];
  const showOrganicCert = categoryName && organicCategories.some(cat => 
    categoryName.toLowerCase().includes(cat.toLowerCase())
  );
  
  const getCO2BadgeClass = (emission: number) => {
    if (emission < 1) return "co2-low";
    if (emission < 3) return "co2-medium";
    return "co2-high";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: parseInt(id),
      name,
      price,
      originalPrice,
      image
    });
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${name} đã được thêm vào giỏ hàng.`,
    });
  };

  return (
    <div 
      className="eco-card group cursor-pointer flex flex-col h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10" 
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Fixed aspect ratio image container */}
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <div className={`co2-badge ${getCO2BadgeClass(co2Emission)}`}>
            <Leaf className="w-3 h-3" />
            {co2Emission}kg CO₂e
          </div>
        </div>
        <div className="absolute top-2 right-2 space-y-1">
          {certification.map((cert) => (
            <Badge key={cert} variant="secondary" className="text-xs bg-white/90">
              {cert}
            </Badge>
          ))}
        </div>
        {/* Certification logos */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <img src={certFairtrade} alt="Fairtrade" className="w-6 h-6 bg-white rounded-sm p-0.5" />
          <img src={certFSC} alt="FSC" className="w-6 h-6 bg-white rounded-sm p-0.5" />
          {showOrganicCert && (
            <img src={certOrganic} alt="Organic" className="w-6 h-6 bg-white rounded-sm p-0.5" />
          )}
        </div>
      </div>

      {/* Content area with flex-grow to push buttons down */}
      <div className="flex flex-col flex-grow space-y-2">
        {/* Title with fixed min-height and line-clamp */}
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">₫{(price || 0).toLocaleString()}</span>
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              ₫{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>⭐ {rating} | Đã bán {sold}</span>
        </div>

        {/* Buttons pushed to bottom with mt-auto */}
        <div className="flex gap-2 pt-2 mt-auto">
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
          >
            <ShoppingCart className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;