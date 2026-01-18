import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  id: number;
  title: string;
  icon: LucideIcon;
  image?: string; 
  itemCount: number;
  description?: string;
}

const CategoryCard = ({ id, title, icon: Icon, itemCount }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/category/${id}`)}
      className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Icon Circle with Hover Effect */}
      <div className="mb-4 p-4 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-inner">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      
      {/* Title */}
      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>
      
      {/* Subtitle */}
      <span className="text-sm text-gray-400 font-medium">
        {itemCount} products
      </span>
    </div>
  );
};

export default CategoryCard;