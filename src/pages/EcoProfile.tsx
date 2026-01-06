import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, Award, Wallet, Copy, TrendingUp, History, Gem, RefreshCw, Landmark, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EcoProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { ecoBalance, vndBalance, shortAddress, walletAddress, totalCO2Saved, rank, streak, stakedAmount, isConnected, nfts, swapEcoToVnd, withdrawVnd } = useWalletContext();
  
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [swapAmount, setSwapAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => { if (user) { fetchUserProfile(); fetchTransactions(); } }, [user]);

  const fetchUserProfile = async () => { const { data } = await supabase.from('users').select('*').eq('id', user?.id).single(); setProfile(data); };
  const fetchTransactions = async () => { const { data } = await supabase.from('transactions').select('*, products(name)').eq('user_id', user?.id).order('created_at', { ascending: false }); if (data) setTransactions(data); };
  const copyAddress = () => { if (walletAddress) { navigator.clipboard.writeText(walletAddress); toast({ title: "Đã sao chép", description: "Địa chỉ ví đã lưu vào clipboard." }); } };

  const handleSwap = () => {
    const amount = parseFloat(swapAmount);
    if (amount > ecoBalance || amount <= 0) return;
    
    // Tính toán hiển thị
    const fee = amount * 0.001;
    const receive = (amount - fee) * 1000;

    swapEcoToVnd(amount);
    setSwapAmount("");
    toast({ 
      title: "Quy đổi thành công", 
      description: `Đã đổi ${amount} ECO sang ${receive.toLocaleString()} VND (Phí ${fee.toFixed(4)} ECO).`, 
      className: "bg-blue-50 border-blue-200" 
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > vndBalance || amount <= 0) return;
    withdrawVnd(amount);
    setWithdrawAmount("");
    toast({ title: "Rút tiền thành công", description: `Đã chuyển ${amount.toLocaleString()} VND về tài khoản ngân hàng liên kết.`, className: "bg-green-50 border-green-200" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>U</AvatarFallback></Avatar>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold">{profile?.full_name || "Eco Warrior"}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              {isConnected ? <span className="bg-secondary px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-border">{shortAddress}<Copy className="w-3 h-3 cursor-pointer hover:text-primary transition-colors" onClick={copyAddress} /></span> : <span className="text-sm text-yellow-600">Chưa kết nối ví</span>}
              <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50">Hạng: {rank}</Badge>
            </div>
          </div>

          <div className="flex gap-4">
            {/* ECO WALLET */}
            <Card className="w-full md:w-auto bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-8 mb-2"><p className="text-emerald-100 text-sm font-medium">ECO Token (On-chain)</p><Wallet className="w-5 h-5 text-emerald-100 opacity-50" /></div>
                <h2 className="text-3xl font-bold flex items-center gap-2">{ecoBalance.toFixed(2)} <span className="text-sm font-medium opacity-80">ECO</span></h2>
                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm" variant="secondary" className="text-emerald-700 hover:bg-white font-bold shadow-sm w-full"><ArrowRightLeft className="w-3 h-3 mr-1" /> Swap VND</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Quy đổi ECO sang VND</DialogTitle><DialogDescription>Tỷ lệ: 1 ECO = 1,000 VND.</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm">Số lượng ECO đổi:</label>
                          <Input type="number" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} placeholder="0.00" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Số dư: {ecoBalance.toFixed(2)} ECO</span>
                            {/* Hiển thị tính toán phí */}
                            {swapAmount && !isNaN(parseFloat(swapAmount)) && (
                              <div className="text-right">
                                <span className="block text-orange-500">Phí (0.1%): {(parseFloat(swapAmount) * 0.001).toFixed(4)} ECO</span>
                                <span className="block text-emerald-600 font-bold mt-1">Nhận: {((parseFloat(swapAmount) * 0.999) * 1000).toLocaleString()} ₫</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter><Button onClick={handleSwap} disabled={!swapAmount || parseFloat(swapAmount) > ecoBalance}>Xác nhận quy đổi</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* FIAT WALLET */}
            <Card className="w-full md:w-auto bg-white text-gray-800 border-2 border-gray-100 shadow-lg transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-8 mb-2"><p className="text-gray-500 text-sm font-medium">Ví VND (Fiat)</p><Landmark className="w-5 h-5 text-gray-400" /></div>
                <h2 className="text-3xl font-bold flex items-center gap-2">{vndBalance.toLocaleString()} <span className="text-sm font-medium text-gray-400">₫</span></h2>
                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm" variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"><Landmark className="w-3 h-3 mr-1" /> Rút về Bank</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Rút tiền về ngân hàng</DialogTitle><DialogDescription>Chuyển VND về tài khoản ngân hàng liên kết.</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><label className="text-sm">Số tiền muốn rút (VND):</label><Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0" /><p className="text-xs text-muted-foreground">Khả dụng: {vndBalance.toLocaleString()} ₫</p></div>
                      </div>
                      <DialogFooter><Button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > vndBalance}>Xác nhận rút</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TABS (Giữ nguyên) */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-muted/50">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="badges">Huy hiệu & NFT</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
             <div className="grid md:grid-cols-3 gap-6">
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">CO2 Đã giảm</CardTitle><Leaf className="w-4 h-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalCO2Saved.toFixed(1)} kg</div><Progress value={(totalCO2Saved/100)*100} className="h-2 mt-3 bg-green-100" indicatorClassName="bg-green-500" /><p className="text-xs text-muted-foreground mt-2">Mục tiêu tiếp theo: 100 kg</p></CardContent></Card>
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Chuỗi ngày xanh</CardTitle><TrendingUp className="w-4 h-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{streak} Ngày</div><div className="flex gap-1 mt-3">{[...Array(streak > 7 ? 7 : streak)].map((_, i) => (<div key={i} className="w-full h-2 rounded-full bg-orange-500 opacity-80"></div>))}</div></CardContent></Card>
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Eco Vault</CardTitle><Wallet className="w-4 h-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stakedAmount.toFixed(2)} ECO</div><p className="text-xs text-muted-foreground mt-1">Đang sinh lời: <span className="text-green-600 font-bold">5-50% APR</span></p></CardContent></Card>
             </div>
          </TabsContent>

          <TabsContent value="badges" className="animate-in fade-in duration-300">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ name: "Người tiên phong", unlocked: true }, { name: "Sống xanh 7 ngày", unlocked: streak >= 7 }].map((badge, i) => (
                   <div key={i} className="flex flex-col items-center justify-center p-6 border rounded-xl text-center gap-3 bg-white shadow-sm">
                      <Award className="w-8 h-8 text-emerald-600" /><span className="font-semibold text-sm">{badge.name}</span>
                   </div>
                ))}
                {nfts.map((nft) => (
                  <div key={nft.id} className="relative flex flex-col items-center justify-center p-6 border-2 border-indigo-100 rounded-xl text-center gap-3 bg-gradient-to-br from-indigo-50 to-white shadow-md overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">NFT</div>
                    <div className="w-16 h-16 bg-white rounded-lg shadow-inner flex items-center justify-center p-2 group-hover:scale-110 transition-transform"><img src={nft.image} alt="NFT" className="w-full h-full object-contain" /></div>
                    <div><span className="font-bold text-sm text-indigo-900 line-clamp-1">{nft.name}</span><span className="text-[10px] text-gray-500">{new Date(nft.date).toLocaleDateString()}</span></div>
                  </div>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-300">
             <Card><CardContent className="pt-6">{transactions.length > 0 ? transactions.map(tx => (<div key={tx.id} className="flex justify-between p-3 border-b last:border-0"><span>{tx.products?.name || tx.note}</span><span className="text-emerald-600 font-bold">+{tx.greenpoints_earned} ECO</span></div>)) : <p className="text-center text-muted-foreground">Chưa có giao dịch.</p>}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EcoProfile;