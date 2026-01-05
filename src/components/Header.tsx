import { Search, ShoppingCart, Leaf, Plus, Home, Wallet, Info, QrCode, Vault } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminProductForm from "@/components/AdminProductForm";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showAdminForm, setShowAdminForm] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-primary block leading-tight">EcoShop</span>
              <span className="text-[10px] text-muted-foreground">Shop-to-Earn</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="flex-1">
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                  onClick={() => navigate('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Trang chủ
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                  onClick={() => navigate('/eco-profile')}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  My Eco Profile
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                  onClick={() => navigate('/eco-vault')}
                >
                  <Vault className="w-4 h-4 mr-2" />
                  Eco Vault
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                  onClick={() => navigate('/about')}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Giới thiệu
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
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
            <Button 
              variant="ghost" 
              size="icon"
              title="Quét mã QR"
            >
              <QrCode className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            
            {/* Connect Wallet Button */}
            <ConnectWalletButton />
          </div>
        </div>
      </div>

      {/* Admin Product Form */}
      <AdminProductForm
        open={showAdminForm}
        onOpenChange={setShowAdminForm}
        onProductAdded={() => {
          window.location.reload();
        }}
      />
    </header>
  );
};

export default Header;
