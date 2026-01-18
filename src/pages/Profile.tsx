import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Gift, User, LogOut, Wallet } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  greenpoints: number;
}

interface Voucher {
  id: string;
  name: string;
  value: string;
  required_points: number;
  description: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded vouchers as requested
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
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, greenpoints')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Cannot load user information",
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

      // Refresh user data
      fetchUserData();
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Cannot redeem voucher: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "See you again!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  My Profile
                </h1>
                <p className="text-muted-foreground">{userData?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* GreenPoint Wallet Card - Green Theme */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Wallet className="w-5 h-5 text-green-600" />
                GreenPoints
              </CardTitle>
              <CardDescription className="text-green-600">
                Points earned from green shopping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-700 flex items-center gap-2">
                  <Coins className="w-8 h-8 text-green-600" />
                  {userData?.greenpoints || 0}
                </div>
                <div className="text-green-600">
                  Available Points
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Exchange Section */}
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
  );
};

export default Profile;