import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Leaf, ShieldCheck, TrendingUp, Wallet, ArrowRight, ArrowLeft, PieChart, Box, Gem, Lock, Unlock, AlertCircle } from "lucide-react"; // Thêm icon Unlock, AlertCircle
import { useWalletContext, Investment } from "@/contexts/WalletContext";
import { Progress } from "@/components/ui/progress"; // Dùng progress bar hiển thị thời gian stake

const STAKING_PACKAGES = [
  { id: "vault_flex", name: "Mầm Xanh (Flexible)", risk: "Rất thấp", apr: "1.5%", duration: "Linh hoạt", min: 10, color: "bg-green-100 text-green-700", icon: Leaf },
  { id: "vault_30d", name: "Cây Non (Locked 30d)", risk: "Thấp", apr: "6%", duration: "30 Ngày", min: 50, color: "bg-teal-100 text-teal-700", icon: ShieldCheck },
  { id: "vault_1y", name: "Rừng Già (Locked 1Y)", risk: "Trung bình", apr: "18%", duration: "12 Tháng", min: 100, color: "bg-blue-100 text-blue-700", icon: TrendingUp },
  { id: "vault_4y", name: "Cổ Thụ (Locked 4Y)", risk: "Cao (Thanh khoản)", apr: "45%", duration: "48 Tháng", min: 500, color: "bg-purple-100 text-purple-700", icon: Gem }
];

const EcoVault = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Lấy thêm hàm unstakeEco
  const { ecoBalance, stakeEco, unstakeEco, stakedAmount, investments } = useWalletContext();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false); // State loading khi rút

  // Hàm tính toán ngày mở khoá
  const getUnlockDetails = (investment: Investment) => {
    const startDate = new Date(investment.date);
    const durationStr = investment.duration.toLowerCase();
    
    // Nếu là linh hoạt -> Luôn mở
    if (durationStr.includes("linh hoạt")) {
      return { isLocked: false, unlockDate: new Date(), progress: 100, daysLeft: 0 };
    }

    let daysToAdd = 0;
    if (durationStr.includes("30 ngày")) daysToAdd = 30;
    else if (durationStr.includes("1 năm") || durationStr.includes("12 tháng")) daysToAdd = 365;
    else if (durationStr.includes("2 năm")) daysToAdd = 730;
    else if (durationStr.includes("4 năm") || durationStr.includes("48 tháng")) daysToAdd = 1460;

    const unlockDate = new Date(startDate);
    unlockDate.setDate(startDate.getDate() + daysToAdd);

    const now = new Date();
    const totalTime = unlockDate.getTime() - startDate.getTime();
    const elapsedTime = now.getTime() - startDate.getTime();
    
    // Tính % thời gian đã trôi qua
    let progress = (elapsedTime / totalTime) * 100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0; // Phòng trường hợp máy user sai giờ

    const isLocked = now < unlockDate;
    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    return { isLocked, unlockDate, progress, daysLeft };
  };

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) { toast({ title: "Lỗi", description: "Vui lòng nhập hợp lệ.", variant: "destructive" }); return; }
    if (amount > ecoBalance) { toast({ title: "Số dư không đủ", description: `Chỉ còn ${ecoBalance.toFixed(2)} ECO.`, variant: "destructive" }); return; }
    const pkg = STAKING_PACKAGES.find(p => p.id === selectedPackage);
    if (pkg && amount < pkg.min) { toast({ title: "Chưa đạt tối thiểu", description: `Yêu cầu tối thiểu ${pkg.min} ECO.`, variant: "destructive" }); return; }

    setIsStaking(true);
    setTimeout(() => {
      stakeEco(amount, 'vault', pkg?.name || "Eco Vault", parseFloat(pkg?.apr.replace('%', '') || "0"), pkg?.duration);
      setIsStaking(false); setStakeAmount("");
      toast({ title: "Staking Thành Công! 🎉", description: `Đã gửi ${amount} ECO vào Vault.`, className: "bg-green-50 border-green-200" });
    }, 1500);
  };

  // Xử lý rút tiền
  const handleUnstake = (id: string, isFlexible: boolean) => {
    setIsUnstaking(true);
    setTimeout(() => {
      // Nếu linh hoạt thì trừ 0.1% phí, nếu không thì 0%
      const fee = isFlexible ? 0.1 : 0;
      unstakeEco(id, fee);
      setIsUnstaking(false);
      
      toast({
        title: "Rút tiền thành công",
        description: isFlexible ? `Đã rút về ví (Phí ${fee}%).` : "Đã tất toán khoản đầu tư.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 pl-0 hover:bg-transparent hover:text-primary"><ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ</Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div><h1 className="text-3xl font-bold text-primary flex items-center gap-2"><TrendingUp className="w-8 h-8" /> Eco Vault</h1><p className="text-muted-foreground mt-1">Gửi tiết kiệm ECO Token - Nhận lãi suất xanh</p></div>
          <Card className="w-full md:w-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4"><div className="p-3 bg-background rounded-full shadow-sm"><Wallet className="w-6 h-6 text-primary" /></div><div><p className="text-xs text-muted-foreground font-medium uppercase">Số dư khả dụng</p><p className="text-2xl font-bold text-primary">{ecoBalance.toFixed(2)} ECO</p></div></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="stake">Gửi Staking (Earn)</TabsTrigger>
            <TabsTrigger value="portfolio">Danh mục đầu tư</TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {STAKING_PACKAGES.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start"><div className={`p-3 rounded-xl ${pkg.color}`}><pkg.icon className="w-6 h-6" /></div><span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium border border-secondary-foreground/10">{pkg.risk}</span></div>
                    <CardTitle className="mt-4 text-xl">{pkg.name}</CardTitle>
                    <CardDescription>APR: <span className={`font-bold text-lg ${pkg.id === 'vault_4y' ? 'text-purple-600' : 'text-green-600'}`}>{pkg.apr}</span></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm flex-grow">
                    <div className="flex justify-between py-2 border-b border-dashed"><span className="text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Thời hạn khoá:</span><span className="font-medium">{pkg.duration}</span></div>
                    <div className="flex justify-between py-2 border-b border-dashed"><span className="text-muted-foreground">Tối thiểu:</span><span className="font-medium">{pkg.min} ECO</span></div>
                    {pkg.id === 'vault_4y' && <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded mt-2">*Dành cho nhà đầu tư dài hạn.</div>}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Dialog>
                      <DialogTrigger asChild><Button className={`w-full ${pkg.id === 'vault_4y' ? 'bg-purple-600 hover:bg-purple-700' : ''}`} onClick={() => setSelectedPackage(pkg.id)}>Stake Ngay <ArrowRight className="w-4 h-4 ml-2" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Gửi tiết kiệm: {pkg.name}</DialogTitle><DialogDescription>Lãi suất {pkg.apr}. {pkg.id !== 'vault_flex' ? 'Không thể rút trước hạn.' : 'Rút bất kỳ lúc nào.'}</DialogDescription></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2"><label className="text-sm font-medium">Số lượng ECO muốn gửi:</label><div className="relative"><Input type="number" placeholder="0.00" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} /><Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 text-xs" onClick={() => setStakeAmount(ecoBalance.toString())}>MAX</Button></div><div className="flex justify-between text-xs text-muted-foreground"><span>Số dư: {ecoBalance.toFixed(2)} ECO</span><span>Tối thiểu: {pkg.min} ECO</span></div></div>
                        </div>
                        <DialogFooter><Button onClick={handleStake} disabled={isStaking} className="w-full">{isStaking ? "Đang xử lý blockchain..." : "Xác nhận Staking"}</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết danh mục đầu tư</CardTitle>
                <CardDescription>Quản lý tài sản và thời gian đáo hạn.</CardDescription>
              </CardHeader>
              <CardContent>
                {investments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg mb-6">
                       <span className="font-bold">Tổng tài sản đang khoá:</span>
                       <span className="text-xl font-bold text-primary">{stakedAmount.toFixed(2)} ECO</span>
                    </div>
                    {investments.map((inv) => {
                      // Tính toán trạng thái khoá/mở cho từng item
                      const { isLocked, unlockDate, progress, daysLeft } = getUnlockDetails(inv);
                      const isFlexible = inv.duration.toLowerCase().includes("linh hoạt");

                      return (
                        <div key={inv.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${inv.type === 'vault' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                {inv.type === 'vault' ? <Leaf className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="font-bold text-base">{inv.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                   <span className="bg-white border px-1.5 py-0.5 rounded shadow-sm">{inv.duration}</span>
                                   <span>APR: {inv.apr}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary">{inv.amount.toFixed(2)} ECO</p>
                              {/* Hiển thị trạng thái Rút tiền */}
                              {isFlexible ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="h-8 mt-1 text-xs border-red-200 text-red-600 hover:bg-red-50">
                                      <Unlock className="w-3 h-3 mr-1" /> Rút ngay
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader><DialogTitle>Rút tiền sớm</DialogTitle><DialogDescription>Bạn đang rút từ gói Linh hoạt.</DialogDescription></DialogHeader>
                                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex gap-3 items-start text-sm">
                                      <AlertCircle className="w-5 h-5 shrink-0" />
                                      <div>Phí rút tiền sớm là <strong>0.1%</strong>. Bạn sẽ nhận về: <strong>{(inv.amount * 0.999).toFixed(2)} ECO</strong>.</div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={() => handleUnstake(inv.id, true)} disabled={isUnstaking} className="w-full bg-red-600 hover:bg-red-700">
                                        {isUnstaking ? "Đang xử lý..." : "Xác nhận Rút tiền"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                // Gói Fixed - Hiển thị trạng thái khoá
                                isLocked ? (
                                  <div className="flex flex-col items-end">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Khoá đến {unlockDate.toLocaleDateString('vi-VN')}</span>
                                  </div>
                                ) : (
                                  <Button size="sm" onClick={() => handleUnstake(inv.id, false)} className="h-8 mt-1 text-xs bg-green-600 hover:bg-green-700">
                                    Đáo hạn - Rút ngay
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar cho gói Fixed */}
                          {!isFlexible && isLocked && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Tiến độ</span>
                                <span>Còn {daysLeft} ngày</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground"><PieChart className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>Danh mục đầu tư trống.</p></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EcoVault;