import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, Link, Zap, RefreshCw, BadgeDollarSign, 
  Target, Layers, TrendingUp, Fingerprint, 
  Database, Box, Cpu, Network
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGreenFund } from "@/contexts/GreenFundContext";

const StrategicModel = () => {
  const { revenuePoolBalance } = useGreenFund();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* PITCH TITLE */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest">
            Sui x EcoShop
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            EcoShop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Tech Architecture</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Leveraging <strong>Sui's Object-Centric Model</strong> to build the Financial Infrastructure for the Green Economy.
          </p>
        </div>

        <Tabs defaultValue="why-sui" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-10 h-14 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {/* Đưa Why Sui lên đầu để BGK thấy ngay */}
            <TabsTrigger value="why-sui" className="rounded-lg font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm">Why Sui?</TabsTrigger>
            <TabsTrigger value="problem" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">Problem</TabsTrigger>
            <TabsTrigger value="business-model" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Business Model</TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Roadmap</TabsTrigger>
            <TabsTrigger value="nft" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Gamification</TabsTrigger>
          </TabsList>

          {/* --- TAB 1: WHY SUI NETWORK (TECH STACK) --- */}
          <TabsContent value="why-sui" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Why we chose Sui Network?</h2>
              <p className="text-gray-500">The only chain capable of handling Supply Chain data & Micro-payments at scale.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Feature 1: Object-Centric */}
              <Card className="border-l-4 border-l-blue-500 bg-blue-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-700">
                    <Box className="w-5 h-5" /> 1. Object-Centric Data Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 text-sm">
                    <strong>Why it matters:</strong> Unlike Ethereum (Account-based), everything on Sui is an Object.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                    <p className="text-xs font-bold text-blue-700 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> EcoShop Application:
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Each <strong>Green Product</strong> and <strong>Shipment Batch</strong> is a mutable Sui Object. We can update its history (Location, CO2 saved) directly on-chain without complex indexing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: Parallel Execution */}
              <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-700">
                    <Cpu className="w-5 h-5" /> 2. Parallel Execution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 text-sm">
                    <strong>Why it matters:</strong> High throughput, low latency. No "Global State" bottleneck.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-cyan-100 shadow-sm">
                    <p className="text-xs font-bold text-cyan-700 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> EcoShop Application:
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Thousands of users buying veggies (micro-transactions) happen simultaneously. Buying an NFT doesn't block buying a T-shirt. <strong>Instant checkout like Web2.</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 3: zkLogin */}
              <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-700">
                    <Fingerprint className="w-5 h-5" /> 3. Sui zkLogin (Mass Adoption)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 text-sm">
                    <strong>The Problem:</strong> Moms & GenZ don't want to manage 12 seed phrases.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
                    <p className="text-xs font-bold text-indigo-700 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> EcoShop Solution:
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Users login with <strong>Google/Facebook</strong>. A Sui wallet is created invisibly in the background. "Invisible Web3" experience.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 4: Walrus Storage */}
              <Card className="border-l-4 border-l-purple-500 bg-purple-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-700">
                    <Database className="w-5 h-5" /> 4. Walrus (Decentralized Storage)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 text-sm">
                    <strong>The Problem:</strong> Storing heavy data (Photos of trash, Certificates) on-chain is expensive.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-purple-100 shadow-sm">
                    <p className="text-xs font-bold text-purple-700 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> EcoShop Integration:
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      We store "Proof of Green" images on <strong>Walrus</strong>. Only the hash is stored on Sui. Ensures cheap, verifiable data integrity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SUI STACK DIAGRAM */}
            <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold mb-6">EcoShop x Sui Stack Architecture</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-blue-600 text-lg py-2 px-4">Sui Move</Badge>
                <span className="text-gray-500 flex items-center">→</span>
                <Badge className="bg-indigo-600 text-lg py-2 px-4">zkLogin</Badge>
                <span className="text-gray-500 flex items-center">→</span>
                <Badge className="bg-cyan-600 text-lg py-2 px-4">SuiNS</Badge>
                <span className="text-gray-500 flex items-center">→</span>
                <Badge className="bg-purple-600 text-lg py-2 px-4">Walrus</Badge>
                <span className="text-gray-500 flex items-center">→</span>
                <Badge className="bg-emerald-600 text-lg py-2 px-4">DeepBook</Badge>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                DeepBook integration planned for Phase 2 to swap ECO tokens to USDC instantly.
              </p>
            </div>
          </TabsContent>

          {/* TAB 2: THE PROBLEM (Giữ nguyên) */}
          <TabsContent value="problem" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Why Consumers Don't Buy Green?</h2>
              <p className="text-gray-500">The 4 barriers preventing mass adoption.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-red-500 bg-red-50/20">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-bold flex items-center gap-2 text-red-700"><BadgeDollarSign className="w-5 h-5" /> 1. The Green Premium</CardTitle></CardHeader>
                <CardContent><p className="text-gray-700 mb-3 text-sm">Green products are <strong>20% - 100% more expensive</strong>.</p><div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"><p className="text-xs font-bold text-emerald-700">Solution:</p><p className="text-xs text-gray-600"><strong>Green Pool Subsidies:</strong> CSR funds auto-discount products.</p></div></CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500 bg-orange-50/20">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-700"><Target className="w-5 h-5" /> 2. "My Impact is Tiny"</CardTitle></CardHeader>
                <CardContent><p className="text-gray-700 mb-3 text-sm">Individual effort feels insignificant.</p><div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"><p className="text-xs font-bold text-emerald-700">Solution:</p><p className="text-xs text-gray-600"><strong>Dynamic NFTs:</strong> Visualize individual contribution.</p></div></CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/20">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-bold flex items-center gap-2 text-yellow-700"><TrendingUp className="w-5 h-5" /> 3. Qualitative Benefits</CardTitle></CardHeader>
                <CardContent><p className="text-gray-700 mb-3 text-sm">"Saving the planet" is vague and hard to verify.</p><div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"><p className="text-xs font-bold text-emerald-700">Solution:</p><p className="text-xs text-gray-600"><strong>On-chain Verification:</strong> CO2 saved is tokenized.</p></div></CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500 bg-purple-50/20">
                <CardHeader className="pb-2"><CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-700"><RefreshCw className="w-5 h-5" /> 4. Habit Friction</CardTitle></CardHeader>
                <CardContent><p className="text-gray-700 mb-3 text-sm">Green lifestyle requires sacrificing convenience.</p><div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"><p className="text-xs font-bold text-emerald-700">Solution:</p><p className="text-xs text-gray-600"><strong>Shop-to-Earn:</strong> Make it profitable to be green.</p></div></CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: BUSINESS MODEL (Giữ nguyên, thêm hiển thị Revenue) */}
          <TabsContent value="business-model" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-gray-900 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-emerald-400 font-bold uppercase text-sm tracking-wider mb-2">Protocol Real Revenue</h3>
                  <div className="text-5xl font-extrabold mb-1">{revenuePoolBalance.toLocaleString()} <span className="text-xl font-normal text-gray-400">VND</span></div>
                  <p className="text-gray-400 text-sm">Generated from 5% transaction fees. Backs Real Yield.</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-white/10 rounded-lg"><p className="text-xs text-gray-400">Grant Pool</p><p className="font-bold">40%</p></div>
                  <div className="text-center px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg"><p className="text-xs text-emerald-300">Revenue</p><p className="font-bold text-emerald-400">60%</p></div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200"><CardHeader><CardTitle className="flex items-center gap-3 text-emerald-800"><BadgeDollarSign className="w-8 h-8" /> 1. Transaction Fee</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-3xl font-extrabold text-gray-900">2% - 5%</div><p className="text-sm text-gray-500">Charged on product sales.</p></CardContent></Card>
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200"><CardHeader><CardTitle className="flex items-center gap-3 text-blue-800"><ShieldCheck className="w-8 h-8" /> 2. Verification Fee</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-3xl font-extrabold text-gray-900">10% Pool</div><p className="text-sm text-gray-500">Retained from Locked Pool if QC passes.</p></CardContent></Card>
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200"><CardHeader><CardTitle className="flex items-center gap-3 text-purple-800"><Layers className="w-8 h-8" /> 3. B2B Data</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-3xl font-extrabold text-gray-900">Subscription</div><p className="text-sm text-gray-500">Acquisition Radar for Big Corps.</p></CardContent></Card>
              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200"><CardHeader><CardTitle className="flex items-center gap-3 text-orange-800"><Link className="w-8 h-8" /> 4. DeFi Yield</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-3xl font-extrabold text-gray-900">0.5% - 1%</div><p className="text-sm text-gray-500">Management fee on Micro-investment vaults.</p></CardContent></Card>
            </div>
          </TabsContent>

          {/* TAB 4: ROADMAP (Giữ nguyên) */}
          <TabsContent value="roadmap" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="relative border-l-4 border-gray-200 ml-6 space-y-12 py-4">
              <div className="relative pl-8"><div className="absolute -left-[14px] top-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-md"></div><h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">Phase 1: Validation <Badge className="bg-emerald-100 text-emerald-700">Live MVP</Badge></h3><p className="text-sm text-gray-500 mb-3">Q4 2025 - Q1 2026</p><ul className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100"><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Launch E-commerce Core.</li><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Integrate Sui Wallet & zkLogin.</li></ul></div>
              <div className="relative pl-8"><div className="absolute -left-[14px] top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md"></div><h3 className="text-xl font-bold text-gray-900">Phase 2: Liquidity & ReFi</h3><p className="text-sm text-gray-500 mb-3">Q2 2026 - Q4 2026</p><ul className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100"><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Launch Micro-investment Vaults.</li><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Secondary Market for Dynamic NFTs.</li></ul></div>
              <div className="relative pl-8"><div className="absolute -left-[14px] top-0 w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-md"></div><h3 className="text-xl font-bold text-gray-900">Phase 3: DePIN & Expansion</h3><p className="text-sm text-gray-500 mb-3">2027+</p><ul className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100"><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> IoT Integration (DePIN).</li><li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> EcoShop DAO.</li></ul></div>
            </div>
          </TabsContent>

          {/* TAB 5: GAMIFICATION (Giữ nguyên) */}
          <TabsContent value="nft" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <Card><CardContent className="p-8"><div className="flex items-center gap-6 mb-6"><div className="p-4 bg-emerald-100 rounded-full"><RefreshCw className="w-8 h-8 text-emerald-600" /></div><div><h3 className="text-xl font-bold">The Eco-Evolution Collection</h3><p className="text-gray-500">Gamification of Green Impact</p></div></div><div className="grid md:grid-cols-3 gap-6"><div className="p-6 border rounded-2xl bg-gray-50 flex flex-col items-center text-center"><div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl">🌱</div><h4 className="font-bold mb-2">1. Seed</h4><p className="text-xs text-gray-600">Free mint.</p></div><div className="p-6 border-2 border-emerald-100 rounded-2xl bg-emerald-50/50 flex flex-col items-center text-center"><div className="w-16 h-16 bg-emerald-200 rounded-full mb-4 flex items-center justify-center text-2xl">🌿</div><h4 className="font-bold mb-2 text-emerald-800">2. Sapling</h4><p className="text-xs text-emerald-700">Evolves at 10kg CO2.</p></div><div className="p-6 border-2 border-purple-200 rounded-2xl bg-purple-50/50 flex flex-col items-center text-center shadow-lg"><div className="w-16 h-16 bg-purple-200 rounded-full mb-4 flex items-center justify-center text-2xl">🌳</div><h4 className="font-bold mb-2 text-purple-800">3. Ancient Tree</h4><p className="text-xs text-purple-700">Evolves at 1000 ECO.</p></div></div></CardContent></Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default StrategicModel;