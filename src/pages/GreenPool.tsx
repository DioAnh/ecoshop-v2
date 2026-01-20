import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGreenFund } from "@/contexts/GreenFundContext";
import { 
  Building2, TrendingUp, ShieldCheck, 
  AlertTriangle, CheckCircle2, Lock, 
  BarChart3, Wallet, ArrowUpRight, Info
} from "lucide-react";

const GreenPool = () => {
  // Lấy dữ liệu từ Context
  const { sponsors = [], totalPoolBalance = 0 } = useGreenFund() || {};

  // Hàm giả lập số liệu tài chính cho từng Vault (vì Context chưa có)
  const getVaultMetrics = (id: number) => {
    // Giả lập APY từ 8% - 15% dựa trên ID
    const apy = 8 + (id % 8); 
    // Giả lập Risk Rating
    const risks = ["Low Risk", "Medium Risk", "Stable"];
    const risk = risks[id % 3];
    // Giả lập Lock Period
    const lock = 30 + (id * 15);
    return { apy, risk, lock };
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* --- SECTION 1: FINANCIAL DASHBOARD --- */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-emerald-500 text-emerald-700 bg-emerald-50 px-3 py-1">
                Institutional Liquidity
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Green Liquidity Pools
              </h1>
              <p className="text-gray-500 mt-2 max-w-2xl">
                Deploy capital into audited green supply chains. Earn <strong>Real Yield</strong> backed by corporate revenue and government bonds.
              </p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="gap-2">
                 <ShieldCheck className="w-4 h-4" /> Safety Module
               </Button>
               <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                 <Wallet className="w-4 h-4" /> Connect Wallet
               </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" /> Total Value Locked
                </div>
                <div className="text-3xl font-extrabold text-gray-900">
                  {(totalPoolBalance || 0).toLocaleString()} <span className="text-sm font-normal text-gray-400">VND</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Avg. Green APY
                </div>
                <div className="text-3xl font-extrabold text-emerald-600">
                  12.4%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Safety Reserve
                </div>
                <div className="text-3xl font-extrabold text-blue-600">
                  {((totalPoolBalance || 0) * 0.05).toLocaleString()} <span className="text-sm font-normal text-gray-400">VND</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Audited Batches
                </div>
                <div className="text-3xl font-extrabold text-purple-600">
                  85
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- SECTION 2: SAFETY MODULE EXPLAINER --- */}
        <div className="mb-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold uppercase text-xs tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Risk Management
            </div>
            <h3 className="text-2xl font-bold mb-2">The Safety Module is Active</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              To protect liquidity providers, <strong>5% of all protocol revenue</strong> is automatically diverted to the On-chain Insurance Fund. This fund covers potential shortfalls in case of audit failures or smart contract risks.
            </p>
          </div>
          <div className="flex items-center gap-8">
             <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">AA+</div>
                <div className="text-xs text-slate-400">Audit Rating</div>
             </div>
             <div className="h-10 w-[1px] bg-slate-600"></div>
             <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100%</div>
                <div className="text-xs text-slate-400">Collateralized</div>
             </div>
          </div>
        </div>

        {/* --- SECTION 3: INVESTMENT VAULTS --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Open Investment Vaults</h2>
            <div className="flex gap-2">
               <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">High Yield</Badge>
               <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Short Lock-up</Badge>
               <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Blue Chip</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => {
              const metrics = getVaultMetrics(sponsor.id);
              const utilization = (sponsor.remainingBalance / (sponsor.totalFunded || 1)) * 100;
              
              return (
                <Card key={sponsor.id} className="hover:shadow-xl transition-all border border-gray-200 hover:border-emerald-500 cursor-pointer group flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm p-1 flex items-center justify-center">
                        <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                      </div>
                      <Badge className={`${metrics.apy >= 12 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} border-0 font-bold`}>
                        {metrics.apy}% APY
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {sponsor.name} Vault
                    </CardTitle>
                    <CardDescription className="line-clamp-1 flex items-center gap-1">
                      {sponsor.focusArea} <Info className="w-3 h-3 text-gray-400" />
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-grow">
                    <div className="space-y-4">
                      {/* Financial Metrics Row */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">Risk Rating</p>
                          <p className="text-sm font-bold text-gray-700">{metrics.risk}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-semibold uppercase">Lock Period</p>
                          <p className="text-sm font-bold text-gray-700 flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3 text-gray-400" /> {metrics.lock} Days
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Pool Utilization</span>
                          <span className="font-bold">{utilization.toFixed(0)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                        <p className="text-[10px] text-gray-400 text-right">
                          {(sponsor.totalFunded - sponsor.remainingBalance).toLocaleString()} / {sponsor.totalFunded.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button className="w-full bg-gray-900 hover:bg-emerald-600 transition-colors gap-2 group-hover:shadow-lg">
                      Deposit Liquidity <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default GreenPool;