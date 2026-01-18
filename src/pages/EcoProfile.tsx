import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, Award, Wallet, Copy, TrendingUp, History, Landmark, ArrowRightLeft, Zap, Target, Gem } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DynamicNFT from "@/components/DynamicNFT"; // MỚI: Import Dynamic NFT

const MOCK_GROWTH_DATA = [
  { name: 'Mon', value: 120 }, { name: 'Tue', value: 132 }, { name: 'Wed', value: 101 }, { name: 'Thu', value: 154 }, { name: 'Fri', value: 190 }, { name: 'Sat', value: 230 }, { name: 'Sun', value: 245 },
];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

const EcoProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { ecoBalance, vndBalance, shortAddress, walletAddress, totalCO2Saved, rank, streak, stakedAmount, isConnected, swapEcoToVnd, withdrawVnd } = useWalletContext();
  
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [swapAmount, setSwapAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const portfolioData = [{ name: 'Available', value: ecoBalance }, { name: 'Staked (Vault)', value: stakedAmount }, { name: 'Pending Rewards', value: ecoBalance * 0.1 }];

  useEffect(() => { if (user) { fetchUserProfile(); fetchTransactions(); } }, [user]);
  const fetchUserProfile = async () => { const { data } = await supabase.from('users').select('*').eq('id', user?.id).single(); setProfile(data); };
  const fetchTransactions = async () => { const { data } = await supabase.from('transactions').select('*, products(name)').eq('user_id', user?.id).order('created_at', { ascending: false }); if (data) setTransactions(data); };
  const copyAddress = () => { if (walletAddress) { navigator.clipboard.writeText(walletAddress); toast({ title: "Copied", description: "Wallet address copied to clipboard." }); } };

  const handleSwap = () => {
    const amount = parseFloat(swapAmount);
    if (amount > ecoBalance || amount <= 0) return;
    const fee = amount * 0.001;
    const receive = (amount - fee) * 1000;
    swapEcoToVnd(amount);
    setSwapAmount("");
    toast({ title: "Swap Successful", description: `Swapped ${amount} ECO to ${receive.toLocaleString()} VND (Fee ${fee.toFixed(4)} ECO).`, className: "bg-blue-50 border-blue-200" });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > vndBalance || amount <= 0) return;
    withdrawVnd(amount);
    setWithdrawAmount("");
    toast({ title: "Withdrawal Successful", description: `Transferred ${amount.toLocaleString()} VND to linked bank account.`, className: "bg-green-50 border-green-200" });
  };

  const nextRankTarget = totalCO2Saved >= 100 ? 500 : totalCO2Saved >= 50 ? 100 : totalCO2Saved >= 20 ? 50 : 20;
  const progressPercent = Math.min((totalCO2Saved / nextRankTarget) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* HEADER PROFILE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-md">
                <Avatar className="w-full h-full border-4 border-white"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>U</AvatarFallback></Avatar>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                Lvl. {Math.floor(totalCO2Saved / 10) + 1}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left w-full space-y-3 pt-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">{profile?.full_name || "Eco Warrior"}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {isConnected ? 
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors" onClick={copyAddress}>
                    {shortAddress} <Copy className="w-3 h-3" />
                  </span> 
                  : <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded border border-yellow-200">Wallet Not Connected</span>
                }
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none shadow-sm text-xs py-1">
                  <Award className="w-3 h-3 mr-1" /> {rank}
                </Badge>
              </div>
              
              <div className="w-full max-w-sm mx-auto md:mx-0 mt-2">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                  <span>Rank Progress</span>
                  <span>{totalCO2Saved.toFixed(1)} / {nextRankTarget} kg CO₂</span>
                </div>
                <Progress value={progressPercent} className="h-1.5 bg-gray-100" indicatorClassName="bg-gradient-to-r from-emerald-400 to-cyan-500" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
             {/* ECO CARD */}
             <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-lg shadow-emerald-100 flex-1 sm:min-w-[240px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                     <div className="p-1.5 bg-white/20 rounded-lg"><Wallet className="w-4 h-4 text-white" /></div>
                     <span className="text-[10px] font-bold bg-emerald-800/30 px-2 py-0.5 rounded tracking-wide">ON-CHAIN</span>
                  </div>
                  <div className="text-2xl font-bold mb-0.5">{ecoBalance.toFixed(2)} ECO</div>
                  <p className="text-emerald-100 text-[10px] opacity-80">≈ {(ecoBalance * 1000).toLocaleString()} VND</p>
                </div>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm" variant="secondary" className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm"><ArrowRightLeft className="w-3 h-3 mr-1.5" /> Swap to VND</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Swap ECO to VND</DialogTitle><DialogDescription>Rate: 1 ECO = 1,000 VND.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div className="space-y-2"><label className="text-sm">Amount ECO:</label><Input type="number" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} placeholder="0.00" /><div className="flex justify-between text-xs text-muted-foreground"><span>Balance: {ecoBalance.toFixed(2)} ECO</span>{swapAmount && !isNaN(parseFloat(swapAmount)) && (<span className="text-emerald-600 font-bold">Receive: {((parseFloat(swapAmount) * 0.999) * 1000).toLocaleString()} ₫</span>)}</div></div></div><DialogFooter><Button onClick={handleSwap} disabled={!swapAmount || parseFloat(swapAmount) > ecoBalance}>Confirm Swap</Button></DialogFooter></DialogContent>
                  </Dialog>
                </div>
             </div>

             {/* VND CARD */}
             <div className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-800 shadow-sm flex-1 sm:min-w-[240px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                     <div className="p-1.5 bg-gray-100 rounded-lg"><Landmark className="w-4 h-4 text-gray-600" /></div>
                     <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500 tracking-wide">FIAT</span>
                  </div>
                  <div className="text-2xl font-bold mb-0.5">{vndBalance.toLocaleString()} đ</div>
                  <p className="text-gray-400 text-[10px]">Available to withdraw</p>
                </div>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm" variant="outline" className="w-full h-8 text-xs hover:bg-gray-50"><Landmark className="w-3 h-3 mr-1.5" /> Withdraw</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Withdraw to Bank</DialogTitle><DialogDescription>24/7 Fast Transfer.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div className="space-y-2"><label className="text-sm">Amount (VND):</label><Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0" /><p className="text-xs text-muted-foreground">Available: {vndBalance.toLocaleString()} ₫</p></div></div><DialogFooter><Button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > vndBalance}>Withdraw Now</Button></DialogFooter></DialogContent>
                  </Dialog>
                </div>
             </div>
          </div>
        </div>

        {/* MAIN DASHBOARD */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview & Charts</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Badges & NFTs</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-md">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-emerald-500" /> Green Asset Growth</CardTitle><CardDescription>Track total ECO Token accumulated over the week.</CardDescription></CardHeader>
                  <CardContent><div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={MOCK_GROWTH_DATA}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} /><Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} /><Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer></div></CardContent>
                </Card>
                <Card className="border-none shadow-md">
                  <CardHeader><CardTitle className="text-lg">Asset Allocation</CardTitle><CardDescription>Wallet vs Vault</CardDescription></CardHeader>
                  <CardContent className="flex flex-col items-center justify-center"><div className="h-[200px] w-full relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={portfolioData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{portfolioData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"><div className="text-2xl font-bold text-gray-800">{(ecoBalance + stakedAmount).toFixed(0)}</div><div className="text-xs text-gray-500">Total ECO</div></div></div><div className="w-full space-y-3 mt-4">{portfolioData.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div><span className="text-gray-600">{item.name}</span></div><span className="font-bold text-gray-900">{item.value.toFixed(2)}</span></div>))}</div></CardContent>
                </Card>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 bg-white rounded-full shadow-sm"><Leaf className="w-8 h-8 text-green-600" /></div><div><p className="text-sm text-green-700 font-medium uppercase tracking-wide">CO2 Reduced</p><h3 className="text-3xl font-extrabold text-green-900">{totalCO2Saved.toFixed(1)} <span className="text-lg">kg</span></h3><p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Top 5% Users</p></div></CardContent></Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 bg-white rounded-full shadow-sm"><Zap className="w-8 h-8 text-orange-500" /></div><div><p className="text-sm text-orange-700 font-medium uppercase tracking-wide">Green Streak</p><h3 className="text-3xl font-extrabold text-orange-900">{streak} <span className="text-lg">Days</span></h3><p className="text-xs text-orange-600 mt-1">Keep streak for x2 rewards!</p></div></CardContent></Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"><CardContent className="p-6 flex items-center gap-4"><div className="p-3 bg-white rounded-full shadow-sm"><Target className="w-8 h-8 text-blue-600" /></div><div><p className="text-sm text-blue-700 font-medium uppercase tracking-wide">Next Goal</p><h3 className="text-2xl font-bold text-blue-900">Eco Champion</h3><div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{width: '65%'}}></div></div></div></CardContent></Card>
             </div>
          </TabsContent>

          {/* MỚI: Tích hợp Dynamic NFT vào Tab Badges */}
          <TabsContent value="badges" className="animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột Trái: NFT Chính (Dynamic) */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-600" /> Eco-Evolution NFT (Soulbound)
                  </h3>
                  <DynamicNFT co2Saved={totalCO2Saved} investedAmount={stakedAmount} />
                  <p className="text-xs text-gray-500 mt-3 text-center italic">
                    NFT này gắn liền với ví của bạn và không thể chuyển nhượng. Nó thể hiện uy tín xanh của bạn.
                  </p>
                </div>

                {/* Cột Phải: Các huy hiệu khác */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 mb-4">Bộ sưu tập huy hiệu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ name: "Pioneer", unlocked: true, desc: "Early Adopter" }, { name: "7-Day Green", unlocked: streak >= 7, desc: "Consistent Habit" }].map((badge, i) => (
                       <div key={i} className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center gap-2 shadow-sm transition-all ${badge.unlocked ? 'bg-white border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'}`}>
                          <div className={`p-3 rounded-full ${badge.unlocked ? 'bg-emerald-50' : 'bg-gray-200'}`}><Award className={`w-6 h-6 ${badge.unlocked ? 'text-emerald-600' : 'text-gray-400'}`} /></div>
                          <div><span className="font-bold text-sm text-gray-800 block">{badge.name}</span><span className="text-[10px] text-gray-500">{badge.desc}</span></div>
                       </div>
                    ))}
                  </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-300">
             <Card className="border-none shadow-md">
                <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                <CardContent>{transactions.length > 0 ? (<div className="space-y-4">{transactions.map(tx => (<div key={tx.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors"><div className="flex items-center gap-4"><div className="p-2 bg-green-100 rounded-full"><Leaf className="w-5 h-5 text-green-600" /></div><div><p className="font-bold text-gray-900">{tx.products?.name || tx.note}</p><p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p></div></div><div className="text-right"><span className="text-emerald-600 font-bold block">+{tx.greenpoints_earned.toFixed(2)} ECO</span><span className="text-xs text-gray-400">-{tx.co2_saved_kg.toFixed(2)}kg CO2</span></div></div>))}</div>) : (<div className="text-center py-10"><History className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No transactions yet.</p></div>)}</CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EcoProfile;