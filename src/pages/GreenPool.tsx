import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGreenFund } from "@/contexts/GreenFundContext";
import { 
  Building2, Leaf, TrendingUp, Handshake, 
  AlertTriangle, ArrowRight, CheckCircle2, 
  BarChart3, Landmark, Network 
} from "lucide-react";

const GreenPool = () => {
  // Lấy dữ liệu từ Context an toàn hơn
  const { sponsors = [], totalPoolBalance = 0 } = useGreenFund() || {};

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* --- SECTION 1: THE MARKET OPPORTUNITY (WHY NOW?) --- */}
        <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-emerald-500 text-emerald-700 px-4 py-1 text-sm font-bold uppercase tracking-wider bg-emerald-50">
              The Market Gap
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Bridging the <span className="text-emerald-600">Trillion-Dollar</span> <br/>
              ESG Disbursement Gap
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Corporations & Governments have billions in Green Bonds & CSR budgets, but they lack a <strong>transparent, measurable, and scalable</strong> disbursement channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <Card className="border-l-4 border-l-red-500 shadow-md bg-red-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-6 h-6" /> The Bottleneck (Current State)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Inefficient Disbursement</h4>
                    <p className="text-sm text-gray-600">Manual charity, tree-planting PR campaigns with no real KPI tracking. <span className="italic">"Where did my 1 million USD actually go?"</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Greenwashing Risk</h4>
                    <p className="text-sm text-gray-600">Self-reported data is untrustworthy. Users don't believe corporate claims anymore.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Fragmentation</h4>
                    <p className="text-sm text-gray-600">Thousands of high-potential green startups exist but are too small for big corps to find and fund individually.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Solution */}
            <Card className="border-l-4 border-l-emerald-500 shadow-md bg-emerald-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" /> The EcoShop Solution (Green Pool)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Direct Smart Disbursement</h4>
                    <p className="text-sm text-gray-600">Smart Contracts auto-release funds ONLY when On-chain Proof of Impact (shipping, sales) is verified.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Acquisition Radar</h4>
                    <p className="text-sm text-gray-600">Sponsors get a dashboard to spot top-performing startups based on real sales data for M&A/Investment.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-gray-800">Aggregated Impact</h4>
                    <p className="text-sm text-gray-600">We bundle thousands of micro-transactions into a single, verifiable Green Bond report for Governments.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- SECTION 2: LIVE METRICS (THE PROOF) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in slide-in-from-bottom duration-700 delay-200">
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-100 font-medium text-xs uppercase tracking-widest flex items-center gap-2">
                <Landmark className="w-4 h-4" /> Total Liquidity Locked
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* FIX LỖI: Thêm || 0 để tránh undefined */}
              <div className="text-4xl font-bold mb-2">{(totalPoolBalance || 0).toLocaleString()} VND</div>
              <p className="text-emerald-100 text-xs opacity-80">Backed by Corporate ESG & Green Bonds</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 font-medium text-xs uppercase tracking-widest">Active LPs (Sponsors)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-2">{sponsors.length}</div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {sponsors.map((s, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden p-1" title={s.name}>
                      <img src={s.logo} alt={s.name} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-400">+ Governments joining soon</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 font-medium text-xs uppercase tracking-widest">Real-time Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600 mb-2">12.5%</div>
              <Progress value={12.5} className="h-2 mb-2" />
              <p className="text-xs text-gray-400">Of funds automatically matched to 15,000+ orders.</p>
            </CardContent>
          </Card>
        </div>

        {/* --- SECTION 3: DEEP DIVE MECHANISM --- */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-lg mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Green Pool Works?</h2>
            <p className="text-gray-500">The Automated Financial Engine for Sustainability</p>
          </div>

          <div className="relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 -z-10 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-blue-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-center px-4">
                  <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200">Step 1: Funding</Badge>
                  <h3 className="font-bold text-lg mb-2">Liquidity Injection</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Big Corps (LPs) deposit <strong>1 Billion+ VND</strong> into specific Smart Contracts (e.g., "Plastic Reduction Pool", "Sustainable Agri Pool").
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                  <Network className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="text-center px-4">
                  <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Step 2: Smart Matching</Badge>
                  <h3 className="font-bold text-lg mb-2">Algorithmic Disbursement</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    User buys verified green product &rarr; Smart Contract triggers: <br/>
                    <span className="text-emerald-700 font-semibold">User gets +10k Voucher</span> (Subsidy) <br/>
                    <span className="text-emerald-700 font-semibold">Startup gets +20k Grant</span> (Support)
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-purple-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                  <BarChart3 className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-center px-4">
                  <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 hover:bg-purple-200">Step 3: ROI & Exit</Badge>
                  <h3 className="font-bold text-lg mb-2">Data & Acquisition</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sponsors access <strong>Acquisition Radar</strong> to find high-growth startups for investment or M&A. Or use On-chain Data for verified ESG Reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SPONSOR CARDS --- */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Strategic Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="hover:shadow-lg transition-all border-l-4 border-l-emerald-500 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <img src={sponsor.logo} alt={sponsor.name} className="h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <Badge variant="outline" className="bg-gray-50">{sponsor.focusArea}</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors">{sponsor.name}</CardTitle>
                {/* FIX LỖI: Thêm || 0 để tránh undefined */}
                <CardDescription>Total Committed: {(sponsor.totalFunded || 0).toLocaleString()} VND</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Available Liquidity</span>
                    {/* FIX LỖI: Thêm || 1 để tránh chia cho 0 */}
                    <span>{((sponsor.remainingBalance / (sponsor.totalFunded || 1)) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(sponsor.remainingBalance / (sponsor.totalFunded || 1)) * 100} className="h-2" />
                  <div className="pt-4 flex items-center text-xs text-gray-400 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Auto-matching enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </main>
    </div>
  );
};

export default GreenPool;