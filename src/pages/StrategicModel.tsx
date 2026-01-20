import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGreenFund } from "@/contexts/GreenFundContext";

const StrategicModel = () => {
  const { revenuePoolBalance } = useGreenFund();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* HERO SECTION: REFI / GREEN ALPHA POSITIONING */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-500">
            EcoShop Whitepaper v2.7
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            The Financial Infrastructure for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              The Green Economy
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            We don't sell "Green". We sell <strong>Alpha</strong>. <br/>
            Transforming passive consumers into <span className="text-gray-900 font-semibold underline decoration-emerald-400">Strategic Micro-Investors</span> via Sui Blockchain.
          </p>
        </div>

        <Tabs defaultValue="why-sui" className="w-full">
          {/* NAVIGATION TABS */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-10 h-auto p-1 bg-gray-100/80 rounded-xl">
            <TabsTrigger value="why-sui" className="py-3 rounded-lg font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Why Sui?
            </TabsTrigger>
            <TabsTrigger value="shop-to-earn" className="py-3 rounded-lg font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Shop-to-Earn
            </TabsTrigger>
            <TabsTrigger value="gtm" className="py-3 rounded-lg font-bold data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Green Alpha (GTM)
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="py-3 rounded-lg font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Roadmap
            </TabsTrigger>
          </TabsList>

          {/* --- TAB 1: WHY SUI? (TECH MOAT) --- */}
          <TabsContent value="why-sui" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">High-Frequency Commerce Needs High-Speed Tech.</h2>
                  <p className="text-lg text-gray-600 mt-2">
                    Our "Shop-to-Earn" model resembles a trading game. Ethereum and Solana cannot handle the "Green Flash Sale".
                  </p>
                </div>
                
                {/* Feature: Parallel Execution */}
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">The "Green Flash Sale" Problem</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    <strong>Scenario:</strong> Vinamilk releases 10,000 Subsidy Vouchers valid for 1 minute.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg border border-red-100">
                      <span className="font-bold text-red-600 block mb-1">Other Chains</span>
                      Gas war. Network crash. $50 fees. Failed UX.
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
                      <span className="font-bold text-emerald-600 block mb-1">Sui Parallel Execution</span>
                      10,000 distinct Objects processed simultaneously. Zero downtime.
                    </div>
                  </div>
                </div>

                {/* Feature: Objects */}
                <div className="p-4 border rounded-xl">
                  <h4 className="font-bold text-gray-900">Sui Objects = Digital Twins</h4>
                  <p className="text-sm text-gray-600">Every product batch is a mutable Object. A "Tree NFT" can own a "Voucher Object" (Composability).</p>
                </div>
              </div>

              {/* SUI STACK VISUAL */}
              <div className="bg-gray-900 text-white rounded-3xl p-8 flex flex-col justify-center h-full min-h-[400px]">
                <div className="mb-8">
                  <Badge className="bg-blue-500 mb-4 hover:bg-blue-600">Sui Stack</Badge>
                  <h3 className="text-2xl font-bold mb-2">Built for Mass Adoption</h3>
                  <p className="text-gray-400">The "Invisible Web3" Experience.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                    <div className="font-bold text-blue-300">zkLogin</div>
                    <div className="text-xs text-gray-400">Login with Google. No seed phrases.</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                    <div className="font-bold text-emerald-300">Sui Indexer</div>
                    <div className="text-xs text-gray-400">Real-time B2B Data & Carbon Credit tracking.</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                    <div className="font-bold text-red-300">Sui Kiosk</div>
                    <div className="text-xs text-gray-400">Enforce Royalties on NFT Secondary Market.</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                    <div className="font-bold text-purple-300">Walrus</div>
                    <div className="text-xs text-gray-400">Decentralized Storage for Proof of Impact images.</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- TAB 2: SHOP-TO-EARN (BUSINESS MODEL) --- */}
          <TabsContent value="shop-to-earn" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Circular "Yield" Economy</h2>
              <p className="text-gray-600">
                We pivoted from a "High Fee" model to a <span className="font-bold text-emerald-600">"Low Fee, High Float"</span> model. 
                We don't charge sellers high fees; we monetize the capital flow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-t-4 border-t-emerald-500 shadow-md">
                <CardHeader>
                  <CardTitle>1. Transaction Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-gray-900 mb-2">1%</div>
                  <p className="text-sm text-gray-600">Aggressively low to undercut Web2 giants (Shopee/TikTok). Removes friction for sellers.</p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500 shadow-md bg-blue-50/30">
                <CardHeader>
                  <CardTitle>2. Strategic Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-gray-900 mb-2">Passive</div>
                  <p className="text-sm text-gray-600">We earn interest on massive idle capital deposited by <strong>Strategic Partners (CSR/Gov)</strong> in the Green Pool.</p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-purple-500 shadow-md">
                <CardHeader>
                  <CardTitle>3. Extended Float</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-gray-900 mb-2">DeFi APY</div>
                  <p className="text-sm text-gray-600">Seller profits are locked until <strong>Audit Pass</strong>. We compound this capital on Sui DeFi (Navi/Scallop) during the lock-up.</p>
                </CardContent>
              </Card>
            </div>

            {/* SAFETY MODULE */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <h3 className="font-bold text-red-900 text-lg">Risk Management: The Safety Module</h3>
              <p className="text-red-700 mt-1">
                5% of Protocol Revenue is automatically diverted to an on-chain <strong>Insurance Fund</strong>. 
                This protects user assets against external DeFi smart contract risks. Safety over Aggressive Yields.
              </p>
            </div>
            
            {/* REVENUE POOL DISPLAY */}
            <div className="bg-gray-900 text-white rounded-2xl p-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <h3 className="text-emerald-400 font-bold uppercase text-sm tracking-wider mb-2">Protocol Real Revenue</h3>
                  <div className="text-5xl font-extrabold mb-1">{(revenuePoolBalance || 0).toLocaleString()} <span className="text-xl font-normal text-gray-400">VND</span></div>
                  <p className="text-gray-400 text-sm">Real-time revenue backing the Yield.</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-white/10 rounded-lg"><p className="text-xs text-gray-400">Safety Reserve</p><p className="font-bold">5%</p></div>
                  <div className="text-center px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg"><p className="text-xs text-emerald-300">Revenue</p><p className="font-bold text-emerald-400">95%</p></div>
                </div>
            </div>
          </TabsContent>

          {/* --- TAB 3: GO-TO-MARKET (GREEN ALPHA) --- */}
          <TabsContent value="gtm" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-purple-500 text-purple-700">Go-To-Market Strategy</Badge>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Don't Sell Green.<br/>Sell <span className="text-purple-600">Alpha</span>.</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our research shows consumers don't buy for the planet. They buy for <strong>Profit, Status, and Community</strong>.
                </p>
                <ul className="space-y-6">
                  <li>
                    <strong className="text-gray-900 block text-lg">Phase 1: The Alpha Seekers.</strong>
                    <p className="text-sm text-gray-500">Target Crypto-natives & GenZ. "Invite Only" access. Position EcoShop as a "Club for Smart Investors" to spot early green assets.</p>
                  </li>
                  <li>
                    <strong className="text-gray-900 block text-lg">Phase 2: The Status Game.</strong>
                    <p className="text-sm text-gray-500">Leaderboards & "Whale" status. Top investors get "Ancient Tree" NFTs that grant governance power and real-life VIP perks.</p>
                  </li>
                  <li>
                    <strong className="text-gray-900 block text-lg">Phase 3: Trojan Horse Adoption.</strong>
                    <p className="text-sm text-gray-500">Target mass market with "Cheaper Prices" (subsidized). They come for the deal, stay for the yield. Green is just a bonus.</p>
                  </li>
                </ul>
              </div>
              
              {/* Visual Card: The "Beta Batch" */}
              <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-0 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">Private Access</Badge>
                    <span className="font-mono text-xs text-purple-200">INVITE #8821</span>
                  </div>
                  <CardTitle className="text-2xl">Vinamilk Beta Batch</CardTitle>
                  <CardDescription className="text-purple-200">Micro-Investment Vault</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-purple-300">Target APY</div>
                      <div className="text-4xl font-bold text-yellow-400">12.5%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-300">Min. Entry</div>
                      <div className="text-xl font-bold">1 ECO</div>
                    </div>
                  </div>
                  <div className="h-2 bg-purple-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[75%]"></div>
                  </div>
                  <p className="text-xs text-center text-purple-300 italic">
                    "Only for Ancient Tree NFT Holders"
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- TAB 4: ROADMAP (COMMUNITY FIRST) --- */}
          <TabsContent value="roadmap" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Roadmap: Community First</h2>
              <p className="text-gray-600">Technology is a commodity. Community is the Moat.</p>
            </div>

            <div className="relative border-l-4 border-gray-200 ml-6 space-y-12 py-4">
              {/* Phase 1 */}
              <div className="relative pl-10">
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-gray-900 rounded-full border-4 border-white shadow-md"></div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Phase 1: Community Genesis</h3>
                  <Badge variant="secondary" className="mt-2">Q4 2025 - Q1 2026</Badge>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-800 mb-2">Focus: Building the "Cult"</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Launch Discord "Investment Club" (Not Environmental Group).</li>
                      <li><strong>"Green Alpha" Campaign:</strong> Pre-launch betting game on green products.</li>
                      <li>MVP Tech: zkLogin & Web Interface only.</li>
                      <li>Goal: 10,000 "Alpha Seekers".</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-10">
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Phase 2: Liquidity & Real Money</h3>
                  <Badge variant="secondary" className="mt-2">Q2 2026 - Q4 2026</Badge>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-800 mb-2">Focus: Financialization</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>ECO Token TGE</strong> on Sui Mainnet.</li>
                      <li>Activate "Micro-investment Vaults" (Real Staking).</li>
                      <li>Deploy <strong>Safety Module</strong> & Audit-Lock Contracts.</li>
                      <li>Integrate DeepBook for ECO/USDC swaps.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-10">
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-emerald-600 rounded-full border-4 border-white shadow-md"></div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Phase 3: Expansion & DAO</h3>
                  <Badge variant="secondary" className="mt-2">2027+</Badge>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-800 mb-2">Focus: Decentralization</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>The "Green Wall Street":</strong> Open Vaults for any SME.</li>
                      <li><strong>IoT DePIN:</strong> Automate audit with sensors.</li>
                      <li>EcoShop DAO: Community takes control of Green Pool.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default StrategicModel;