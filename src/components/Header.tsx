import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, Menu, X, Leaf, 
  Store, BarChart3, ShieldCheck, User, 
  Truck, Building2, ChevronDown, Landmark // <--- Thêm Landmark icon
} from "lucide-react";
import { ConnectButton } from '@suiet/wallet-kit'; 
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  
  const [currentRole, setCurrentRole] = useState<"Consumer" | "Shipper" | "Business">("Consumer");

  // Danh sách Menu - Đã thêm "Eco Vault"
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Market", path: "/products", icon: <Store className="w-4 h-4" /> },
    { label: "Green Pool", path: "/green-pool", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Eco Vault", path: "/eco-vault", icon: <Landmark className="w-4 h-4" /> }, // <--- MỤC MỚI
    { label: "Strategy", path: "/strategy", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleRoleChange = (role: "Consumer" | "Shipper" | "Business") => {
    setCurrentRole(role);
    if (role === "Shipper") navigate("/shipper");
    else if (role === "Business") navigate("/business");
    else navigate("/"); 
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center gap-2 group mr-4">
          <div className="bg-emerald-600 text-white p-1.5 rounded-lg group-hover:bg-emerald-700 transition-colors">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
            EcoShop
          </span>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant="ghost" 
                className={`text-sm font-medium transition-all ${
                  isActive(item.path) 
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" 
                    : "text-gray-600 hover:text-emerald-600 hover:bg-transparent"
                }`}
              >
                {item.icon && <span className="mr-2 opacity-70">{item.icon}</span>}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* RIGHT: ACTIONS & ROLE SWITCHER */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          
          {/* ROLE SWITCHER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden md:flex items-center gap-2 bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100 h-9">
                {currentRole === "Consumer" && <User className="w-4 h-4" />}
                {currentRole === "Shipper" && <Truck className="w-4 h-4" />}
                {currentRole === "Business" && <Building2 className="w-4 h-4" />}
                <span className="font-semibold">{currentRole}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleRoleChange("Consumer")} className="cursor-pointer gap-2">
                <User className="w-4 h-4" /> Consumer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("Shipper")} className="cursor-pointer gap-2">
                <Truck className="w-4 h-4" /> Shipper
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("Business")} className="cursor-pointer gap-2">
                <Building2 className="w-4 h-4" /> Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CART BUTTON */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-emerald-600">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px]">
                  {items.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* PROFILE BUTTON */}
          <Link to="/eco-profile" className="hidden sm:block">
             <Button variant="ghost" className="text-gray-700 hover:text-emerald-600 hover:bg-gray-50 flex items-center gap-2 px-3">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
             </Button>
          </Link>

          {/* CONNECT WALLET */}
          <div className="hidden sm:block">
             <ConnectButton 
                label="Connect Wallet"
                className="!bg-emerald-600 !text-white !font-bold !rounded-full !px-4 !h-10 hover:!bg-emerald-700 transition-all text-sm"
             />
          </div>

          {/* MOBILE MENU TOGGLE */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU CONTENT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${isActive(item.path) ? "bg-emerald-50 text-emerald-700" : ""}`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Button>
            </Link>
          ))}
          
          <hr className="my-2 border-gray-100" />
          
          {/* Mobile Role Switcher */}
          <p className="text-xs font-semibold text-gray-400 uppercase px-4 mb-1">Switch Role</p>
          <div className="grid grid-cols-3 gap-2 px-2">
             <Button variant={currentRole === "Consumer" ? "default" : "outline"} size="sm" onClick={() => handleRoleChange("Consumer")} className={currentRole === "Consumer" ? "bg-emerald-600" : ""}>Consumer</Button>
             <Button variant={currentRole === "Shipper" ? "default" : "outline"} size="sm" onClick={() => handleRoleChange("Shipper")} className={currentRole === "Shipper" ? "bg-blue-600" : ""}>Shipper</Button>
             <Button variant={currentRole === "Business" ? "default" : "outline"} size="sm" onClick={() => handleRoleChange("Business")} className={currentRole === "Business" ? "bg-purple-600" : ""}>Business</Button>
          </div>

          <div className="pt-2 mt-2 border-t border-gray-100">
             <ConnectButton className="!w-full !justify-center" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;