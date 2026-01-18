import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Gift, Wallet, TreePine, TrendingUp, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserData {
  id: string;
  email: string;
  greenpoints: number;
}

interface Transaction {
  id: number;
  created_at: string;
  greenpoints_earned: number;
  co2_saved: number;
  note: string;
  amount: number;
}

interface Voucher {
  id: string;
  name: string;
  value: string;
  required_points: number;
  description: string;
}

const GreenPointsWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [co2ChartData, setCo2ChartData] = useState<any[]>([]);

  const availableVouchers: Voucher[] = [
    {
      id: 'voucher-50k',
      name: 'Voucher 50K',
      value: '50.000đ',
      required_points: 100,
      description: 'Discount 50.000đ for orders from 200.000đ'
    },
    {
      id: 'voucher-100k',
      name: 'Voucher 100K', 
      value: '100.000đ',
      required_points: 200,
      description: 'Discount 100.000đ for orders from 500.000đ'
    },
    {
      id: 'voucher-200k',
      name: 'Voucher 200K',
      value: '200.000đ', 
      required_points: 400,
      description: 'Discount 200.000đ for orders from 1.000.000đ'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, greenpoints')
        .eq('id', user?.id)
        .single();

      if (userError) throw userError;
      setUserData(userData);

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (transactionError) throw transactionError;
      setTransactions(transactionData || []);

      // Calculate total CO2 saved
      const totalCO2 = transactionData?.reduce((sum, transaction) => 
        sum + (transaction.co2_saved || 0), 0) || 0;
      setTotalCO2Saved(totalCO2);

      // Generate CO2 chart data for the past month (30 days)
      const chartData = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = (transactionData || []).filter(t => {
          const transactionDate = new Date(t.created_at).toISOString().split('T')[0];
          return transactionDate === dateStr;
        });
        
        const dayCO2 = dayTransactions.reduce((sum, t) => sum + (t.co2_saved || 0), 0);
        
        chartData.push({
          date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          co2_saved: Number(dayCO2.toFixed(2)),
          fullDate: dateStr
        });
      }
      setCo2ChartData(chartData);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Cannot load information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemVoucher = async (voucher: Voucher) => {
    if (!userData || userData.greenpoints < voucher.required_points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${voucher.required_points} GreenPoints to redeem this voucher`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Deduct points from user
      const newPoints = userData.greenpoints - voucher.required_points;
      const { error: updateError } = await supabase
        .from('users')
        .update({ greenpoints: newPoints })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          product_id: null,
          amount: 0,
          greenpoints_earned: -voucher.required_points,
          co2_saved: 0,
          note: `Redeemed ${voucher.name}`
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Voucher Redeemed!",
        description: `You successfully redeemed ${voucher.name}`,
      });

      // Refresh data
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Cannot redeem voucher: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Please login to view GreenPoints Wallet</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary" />
              GreenPoints Wallet
            </h1>
            <p className="text-muted-foreground">Manage your reward points and environmental impact</p>
          </div>

        {/* CO2 Emissions Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Personal CO₂ Emissions (30 Days)
            </CardTitle>
            <CardDescription>
              Track CO₂ saved from your green activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {co2ChartData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TreePine className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No CO₂ emission data yet</p>
                  <p className="text-sm mt-1">Start shopping green to track your impact!</p>
                </div>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={co2ChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      label={{ 
                        value: 'CO₂ Saved (kg)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: 'hsl(var(--muted-foreground))' }
                      }}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} kg`, 'CO₂ Saved']}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="co2_saved" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 7, fill: "hsl(var(--primary))" }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* GreenPoints Balance */}
            <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Coins className="w-5 h-5" />
                  GreenPoints Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData?.greenpoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Points
                </div>
              </CardContent>
            </Card>

            {/* CO2 Saved */}
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TreePine className="w-5 h-5" />
                  CO₂ Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {totalCO2Saved.toFixed(2)}
                </div>
                <div className="text-sm text-green-600">
                  kg CO2
                </div>
              </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <ShoppingBag className="w-5 h-5" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {transactions.length}
                </div>
                <div className="text-sm text-blue-600">
                  Green Transactions
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  Track recent transactions and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No transactions yet
                    </p>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.note || 'Purchase Transaction'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('en-US')}
                          </p>
                          {transaction.co2_saved > 0 && (
                            <p className="text-sm text-green-600">
                              Saved: {transaction.co2_saved}kg CO2
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            transaction.greenpoints_earned >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {transaction.greenpoints_earned >= 0 ? '+' : ''}{transaction.greenpoints_earned} points
                          </div>
                          {transaction.amount > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {transaction.amount.toLocaleString('vi-VN')}đ
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voucher Exchange */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Redeem Voucher
                </CardTitle>
                <CardDescription>
                  Use GreenPoints to redeem discount vouchers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableVouchers.map((voucher) => {
                  const hasEnoughPoints = userData && userData.greenpoints >= voucher.required_points;
                  
                  return (
                    <div key={voucher.id} className="p-4 border border-border rounded-lg bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{voucher.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{voucher.description}</p>
                          <div className="text-lg font-bold text-green-600">{voucher.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {voucher.required_points} points
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => redeemVoucher(voucher)}
                          disabled={!hasEnoughPoints}
                          className={hasEnoughPoints 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }
                        >
                          {hasEnoughPoints ? "Redeem" : "Insufficient Points"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenPointsWallet;