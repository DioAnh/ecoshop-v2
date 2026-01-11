import { ShoppingCart, User, Menu, Search, Package, Store, Truck, ShieldCheck, LogOut, Copy, ChevronDown, Wallet, Home, LayoutDashboard, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useWalletContext } from "@/contexts/WalletContext";
import { useWallet, ConnectButton } from '@suiet/wallet-kit'; // Import ConnectButton
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { cartCount } = useCart();
  const { user, role, switchRole } = useAuth();
  const { ecoBalance } = useWalletContext();
  const navigate = useNavigate();
  
  const wallet = useWallet();
  const { toast } = useToast();

  const roleConfig: Record<UserRole, { color: string; icon: any; label: string }> = {
    consumer: { color: "bg-emerald-100 text-emerald-800", icon: User, label: "Người mua" },
    shipper: { color: "bg-blue-100 text-blue-800", icon: Truck, label: "Shipper" },
    business: { color: "bg-purple-100 text-purple-800", icon: Store, label: "Doanh nghiệp" },
    verifier: { color: "bg-orange-100 text-orange-800", icon: ShieldCheck, label: "Kiểm định viên" },
  };

  const currentRoleConfig = roleConfig[role] || roleConfig['consumer'];

  const handleCopyAddress = () => {
    if (wallet.account?.address) {
      navigator.clipboard.writeText(wallet.account.address);
      toast({ title: "Đã sao chép", description: "Địa chỉ ví đã lưu vào clipboard." });
    }
  };

  const handleDisconnect = () => {
    wallet.disconnect();
    toast({ title: "Đã ngắt kết nối", description: "Ví của bạn đã đăng xuất thành công." });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* --- LEFT SECTION: LOGO & MENU --- */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <LeafIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary hidden md:inline-block">EcoShop</span>
          </div>

          {/* Navigation Links (ĐÃ KHÔI PHỤC) */}
          {role === 'consumer' && (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="w-4 h-4" /> Trang chủ</Link>
              <Link to="/eco-profile" className="hover:text-primary flex items-center gap-1"><User className="w-4 h-4" /> My Eco Profile</Link>
              <Link to="/eco-vault" className="hover:text-primary flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Eco Vault</Link>
              <Link to="/about" className="hover:text-primary flex items-center gap-1"><Info className="w-4 h-4" /> Giới thiệu</Link>
            </nav>
          )}
        </div>

        {/* --- MIDDLE SECTION: SEARCH BAR --- */}
        {role === 'consumer' && (
          <div className="hidden md:flex flex-1 max-w-sm mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-secondary/50 border-none h-9" placeholder="Tìm kiếm sản phẩm xanh..." />
          </div>
        )}

        {/* --- RIGHT SECTION: ACTIONS --- */}
        <div className="flex items-center gap-3">
          
          {/* ROLE SWITCHER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={`border-2 ${currentRoleConfig.color} border-transparent hover:border-current transition-all h-9`}>
                <currentRoleConfig.icon className="w-4 h-4 mr-2" />
                <span className="font-bold hidden sm:inline-block">{currentRoleConfig.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Chế độ Demo (Switch Role)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole('consumer')} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Consumer (Người mua)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('shipper')} className="cursor-pointer">
                <Truck className="w-4 h-4 mr-2" /> Shipper (Vận chuyển)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('business')} className="cursor-pointer">
                <Store className="w-4 h-4 mr-2" /> Business (Doanh nghiệp)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('verifier')} className="cursor-pointer">
                <ShieldCheck className="w-4 h-4 mr-2" /> Verifier (Kiểm định)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* WALLET LOGIC (ĐÃ SỬA) */}
          {wallet.connected ? (
            // Nếu ĐÃ kết nối -> Hiện Custom Dropdown để Logout
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center bg-secondary/50 px-3 py-1.5 rounded-full border border-border h-9 hover:bg-secondary/80">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span className="text-xs font-mono font-medium text-foreground mr-2">
                    {wallet.account?.address ? `${wallet.account.address.substring(0, 4)}...${wallet.account.address.substring(wallet.account.address.length - 4)}` : 'Connected'}
                  </span>
                  <div className="h-4 w-px bg-border mx-1"></div>
                  <span className="text-xs font-bold text-primary ml-1 mr-1">
                    {ecoBalance ? ecoBalance.toFixed(2) : '0.00'} ECO
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Ví Web3</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
                  <Copy className="w-4 h-4 mr-2" /> Sao chép địa chỉ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" /> Ngắt kết nối ví
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Nếu CHƯA kết nối -> Hiện nút ConnectButton của thư viện
            <div className="scale-90 origin-right">
                <ConnectButton label="Kết nối ví" />
            </div>
          )}

          {/* Cart Icon */}
          {role === 'consumer' && (
            <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          )}

          {/* Profile Icon Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => navigate('/eco-profile')}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const LeafIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
);

export default Header;