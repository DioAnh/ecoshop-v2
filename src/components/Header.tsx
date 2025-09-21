import { Search, ShoppingCart, User, Leaf, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminProductForm from "@/components/AdminProductForm";

const Header = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showAdminForm, setShowAdminForm] = useState(false);
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">EcoShop</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Tìm kiếm sản phẩm xanh..."
                className="search-input pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminForm(true)}
                title="Thêm sản phẩm"
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => user ? navigate('/profile') : navigate('/auth')}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Product Form */}
      <AdminProductForm
        open={showAdminForm}
        onOpenChange={setShowAdminForm}
        onProductAdded={() => {
          // Refresh the page to show new products
          window.location.reload();
        }}
      />
    </header>
  );
};

export default Header;