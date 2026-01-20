import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coins, LogOut, Wallet, TrendingUp, PieChart, ArrowUpRight, Leaf } from 'lucide-react';
import Header from "@/components/Header"; // Thêm Header cho đồng bộ

interface UserData {
  id: string;
  email: string;
  greenpoints: number; // Trong ReFi, đây là số dư ECO Token
}

// Mock Investment Positions (Thay cho Vouchers)
const activePositions = [
  { id: 1, asset: "Vinamilk Batch #88", amount: "450 ECO", apy: "12.5%", profit: "+12.4 ECO", status: "Earning" },
  { id: 2, asset: "ST25 Rice Export", amount: "1,200 ECO", apy: "8.2%", profit: "+4.1 ECO", status: "Locked" },
  { id: 3, asset: "Cocoon Organic", amount: "200 ECO", apy: "10.0%", profit: "+1.2 ECO", status: "Earning" },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchUserData(); }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.from('users').select('id, email, greenpoints').eq('id', user?.id).single();
      if (error) throw error;
      setUserData(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed Out", description: "Portfolio data secured." });
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Portfolio...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* HEADER PROFILE */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {userData?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
                {userData?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="w-4 h-4" /> Disconnect
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* NET WORTH CARD */}
            <Card className="bg-gray-900 text-white border-0 shadow-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Total Net Worth
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold mb-2 flex items-center gap-2">
                        {(userData?.greenpoints || 0).toLocaleString()} <span className="text-lg font-normal text-gray-500">ECO</span>
                    </div>
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12.5% this month
                    </div>
                </CardContent>
            </Card>

            {/* UNCLAIMED YIELD */}
            <Card className="bg-white border-emerald-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Coins className="w-4 h-4" /> Unclaimed Yield
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gray-900 mb-2">17.7 <span className="text-lg font-normal text-gray-400">ECO</span></div>
                    <Button size="sm" className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 h-8 text-xs font-bold">
                        Claim Rewards
                    </Button>
                </CardContent>
            </Card>

            {/* NFT RANK */}
            <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-purple-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Leaf className="w-4 h-4" /> Current Rank
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-purple-900 mb-1">Sapling 🌱</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-purple-500 h-full w-[45%]"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-right">450 / 1000 XP to Ancient Tree</p>
                </CardContent>
            </Card>
        </div>

        {/* ACTIVE POSITIONS TABLE */}
        <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg font-bold">Active Investment Positions</CardTitle>
                        <CardDescription>Your capital deployed in Green Supply Chains</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <PieChart className="w-4 h-4" /> Portfolio Analytics
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Asset</th>
                                <th className="px-4 py-3">Staked Amount</th>
                                <th className="px-4 py-3">APY</th>
                                <th className="px-4 py-3">Unrealized Profit</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activePositions.map((pos) => (
                                <tr key={pos.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-4 py-4 font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                        {pos.asset}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600 font-medium">{pos.amount}</td>
                                    <td className="px-4 py-4 text-emerald-600 font-bold">{pos.apy}</td>
                                    <td className="px-4 py-4 text-gray-900 font-bold">{pos.profit}</td>
                                    <td className="px-4 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            pos.status === 'Earning' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {pos.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Profile;