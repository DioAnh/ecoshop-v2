import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, ShieldCheck, TrendingUp, Wallet, ArrowRight, ArrowLeft, 
  PieChart, Gem, Lock, Unlock, AlertCircle, Banknote, Landmark 
} from "lucide-react"; 
import { useWalletContext, Investment } from "@/contexts/WalletContext";
import { Progress } from "@/components/ui/progress";

// Giữ nguyên Logic các gói cước của bạn
const STAKING_PACKAGES = [
  { id: "vault_flex", name: "Sprout (Flexible)", risk: "Risk Free", apr: "1.5%", duration: "Flexible", min: 10, color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Leaf },
  { id: "vault_30d", name: "Sapling (Fixed 30d)", risk: "Low Risk", apr: "6.0%", duration: "30 Days", min: 50, color: "bg-teal-50 text-teal-700 border-teal-200", icon: ShieldCheck },
  { id: "vault_1y", name: "Forest (Fixed 1Y)", risk: "Medium Yield", apr: "18.0%", duration: "12 Months", min: 100, color: "bg-blue-50 text-blue-700 border-blue-200", icon: TrendingUp },
  { id: "vault_4y", name: "Ancient Tree (VIP)", risk: "High Yield", apr: "45.0%", duration: "48 Months", min: 500, color: "bg-purple-50 text-purple-700 border-purple-200", icon: Gem }
];

const EcoVault = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { ecoBalance, stakeEco, unstakeEco, stakedAmount, investments } = useWalletContext();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Logic tính toán ngày mở khóa (Giữ nguyên)
  const getUnlockDetails = (investment: Investment) => {
    const startDate = new Date(investment.date);
    const durationStr = investment.duration.toLowerCase();
    
    if (durationStr.includes("flexible") || durationStr.includes("linh hoạt")) {
      return { isLocked: false, unlockDate: new Date(), progress: 100, daysLeft: 0 };
    }

    let daysToAdd = 0;
    if (durationStr.includes("30 days")) daysToAdd = 30;
    else if (durationStr.includes("12 months")) daysToAdd = 365;
    else if (durationStr.includes("48 months")) daysToAdd = 1460;

    const unlockDate = new Date(startDate);
    unlockDate.setDate(startDate.getDate() + daysToAdd);

    const now = new Date();
    const totalTime = unlockDate.getTime() - startDate.getTime();
    const elapsedTime = now.getTime() - startDate.getTime();
    
    let progress = (elapsedTime / totalTime) * 100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    const isLocked = now < unlockDate;
    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    return { isLocked, unlockDate, progress, daysLeft };
  };

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) { toast({ title: "Invalid Amount", variant: "destructive" }); return; }
    if (amount > ecoBalance) { toast({ title: "Insufficient Balance", description: `You have ${ecoBalance.toFixed(2)} ECO`, variant: "destructive" }); return; }
    
    const pkg = STAKING_PACKAGES.find(p => p.id === selectedPackage);
    if (pkg && amount < pkg.min) { toast({ title: "Minimum Requirement", description: `Minimum is ${pkg.min} ECO`, variant: "destructive" }); return; }

    setIsStaking(true);
    setTimeout(() => {
      stakeEco(amount, 'vault', pkg?.name || "Eco Vault", parseFloat(pkg?.apr.replace('%', '') || "0"), pkg?.duration);
      setIsStaking(false); setStakeAmount("");
      toast({ title: "Staking Successful", description: `You staked ${amount} ECO. Passive income activated.` });
    }, 1500);
  };

  const handleUnstake = (id: string, isFlexible: boolean) => {
    setIsUnstaking(true);
    setTimeout(() => {
      const fee = isFlexible ? 0.1 : 0;
      unstakeEco(id, fee);
      setIsUnstaking(false);
      toast({ title: "Asset Withdrawn", description: isFlexible ? `Fee charged: ${fee}%` : "Matured asset unlocked." });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <Button variant="ghost" onClick={() => navigate("/")} className="pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Landmark className="w-8 h-8 text-emerald-600" /> Staking Protocol
            </h1>
            <p className="text-gray-500 mt-1">
              Passive Income. Lock your <strong className="text-emerald-700">ECO Tokens</strong> to earn compound interest.
            </p>
          </div>
          
          {/* BALANCE CARD */}
          <Card className="w-full md:w-auto bg-white shadow-sm border-emerald-100">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Available to Stake</p>
                <p className="text-2xl font-extrabold text-gray-900">{ecoBalance.toLocaleString()} ECO</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CROSS-SELL NOTICE (Kết nối với Green Pool) */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
           <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
           <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-800">Want higher yields (Up to 25%)?</h4>
              <p className="text-xs text-blue-600 mt-1">
                Staking here is safe (Low Risk). To earn higher APY, consider investing directly in Supply Chain Batches at the <span onClick={() => navigate('/green-pool')} className="underline cursor-pointer font-bold hover:text-blue-800">Green Pool Market</span>.
              </p>
           </div>
        </div>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-200/50 p-1">
            <TabsTrigger value="stake" className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 font-bold">Earn (Staking Pools)</TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 font-bold">My Portfolio</TabsTrigger>
          </TabsList>

          {/* TAB 1: STAKING PACKAGES */}
          <TabsContent value="stake" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {STAKING_PACKAGES.map((pkg) => (
                <Card key={pkg.id} className={`hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 cursor-pointer flex flex-col group bg-white`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl ${pkg.color} border`}>
                        <pkg.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="bg-gray-50">{pkg.risk}</Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl group-hover:text-emerald-700 transition-colors">{pkg.name}</CardTitle>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-gray-900">{pkg.apr}</span>
                        <span className="text-sm text-gray-500 font-medium">APY</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 text-sm flex-grow">
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Lock Period</span>
                            <span className="font-bold text-gray-900">{pkg.duration}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Min. Deposit</span>
                            <span className="font-bold text-gray-900">{pkg.min} ECO</span>
                        </div>
                    </div>
                    {pkg.id === 'vault_4y' && (
                        <p className="text-xs text-purple-600 flex items-center gap-1">
                            <Gem className="w-3 h-3" /> Includes "Ancient Tree" NFT status.
                        </p>
                    )}
                  </CardContent>

                  <CardFooter className="mt-auto pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={`w-full font-bold ${pkg.id === 'vault_4y' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-emerald-600'}`} onClick={() => setSelectedPackage(pkg.id)}>
                            Stake Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Staking: {pkg.name}</DialogTitle>
                            <DialogDescription>
                                You are locking ECO tokens for {pkg.duration} to earn {pkg.apr} APY.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Amount to Stake</label>
                            <div className="relative">
                                <Input type="number" placeholder="0.00" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="pr-16 text-lg font-bold" />
                                <div className="absolute right-1 top-1 flex items-center h-full">
                                    <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-emerald-600 hover:text-emerald-700" onClick={() => setStakeAmount(ecoBalance.toString())}>MAX</Button>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Available: {ecoBalance.toFixed(2)} ECO</span>
                                <span>Min: {pkg.min} ECO</span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleStake} disabled={isStaking} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
                            {isStaking ? "Processing Transaction..." : "Confirm Deposit"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: PORTFOLIO */}
          <TabsContent value="portfolio">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Your Staked Assets</CardTitle>
                        <CardDescription>Monitor your active staking positions and maturity.</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Staked</p>
                        <p className="text-2xl font-extrabold text-emerald-600">{stakedAmount.toFixed(2)} ECO</p>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                {investments.length > 0 ? (
                  <div className="space-y-4">
                    {investments.map((inv) => {
                      const { isLocked, unlockDate, progress, daysLeft } = getUnlockDetails(inv);
                      const isFlexible = inv.duration.toLowerCase().includes("flexible");

                      return (
                        <div key={inv.id} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inv.type === 'vault' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Banknote className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{inv.name}</p>
                                <p className="text-xs text-gray-500">{inv.duration} Term • {inv.apr}% APY</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-emerald-700">{inv.amount.toFixed(2)} ECO</p>
                              <p className="text-xs text-emerald-600 font-medium">+{(inv.amount * inv.apr / 100).toFixed(2)} Est. Yield</p>
                            </div>
                          </div>
                          
                          {/* Progress & Actions */}
                          <div className="flex items-center gap-4">
                              <div className="flex-grow space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                                      <span>Maturity Progress</span>
                                      <span>{isFlexible ? "Always Unlocked" : (isLocked ? `${daysLeft} days left` : "Matured")}</span>
                                  </div>
                                  <Progress value={progress} className={`h-2 ${isFlexible ? "bg-emerald-100" : ""}`} indicatorColor={isLocked ? "bg-blue-500" : "bg-emerald-500"} />
                              </div>
                              
                              <div className="shrink-0">
                                {isFlexible ? (
                                    <Dialog>
                                        <DialogTrigger asChild><Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Withdraw</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Early Withdrawal</DialogTitle></DialogHeader>
                                            <p className="text-sm text-gray-600">Flexible savings withdrawal fee is <strong>0.1%</strong>.</p>
                                            <DialogFooter><Button onClick={() => handleUnstake(inv.id, true)} className="bg-red-600 hover:bg-red-700">Confirm Withdraw</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button size="sm" disabled={isLocked} onClick={() => handleUnstake(inv.id, false)} className={isLocked ? "bg-gray-100 text-gray-400" : "bg-emerald-600 hover:bg-emerald-700"}>
                                        {isLocked ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                                        {isLocked ? "Locked" : "Claim & Unstake"}
                                    </Button>
                                )}
                              </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">No active staking positions.</p>
                    <p className="text-sm text-gray-400">Start earning passive income today.</p>
                  </div>
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