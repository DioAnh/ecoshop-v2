import { ShoppingCart, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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
  sold 
}: ProductCardProps) => {
  const navigate = useNavigate();
  const getCO2BadgeClass = (emission: number) => {
    if (emission < 1) return "co2-low";
    if (emission < 3) return "co2-medium";
    return "co2-high";
  };

  return (
    <div className="eco-card group cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">₫{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              ₫{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>⭐ {rating} | Đã bán {sold}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs bg-primary hover:bg-primary-hover"
          >
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-2"
          >
            <ShoppingCart className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;