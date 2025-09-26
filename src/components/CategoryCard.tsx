import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  id: number;
  title: string;
  icon: LucideIcon;
  image: string;
  description: string;
  itemCount: number;
}

const CategoryCard = ({ id, title, icon: Icon, image, description, itemCount }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${id}`);
  };

  return (
    <div 
      className="category-card cursor-pointer hover:transform hover:scale-105 transition-all duration-200" 
      onClick={handleClick}
    >
      <div className="relative mb-4">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title}
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <span className="text-xs text-primary font-medium">{itemCount} sản phẩm</span>
    </div>
  );
};

export default CategoryCard;