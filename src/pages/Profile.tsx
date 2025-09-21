import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Gift, User, LogOut, Wallet, ShoppingBag } from 'lucide-react';

interface Profile {
  id: string;
  green_points: number;
  first_name: string | null;
  last_name: string | null;
}

interface Voucher {
  id: string;
  name: string;
  discount_percentage: number;
  required_points: number;
  description: string;
}

interface UserVoucher {
  id: string;
  voucher: Voucher;
  used_at: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchVouchers();
      fetchUserVouchers();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('vouchers')
        .select('*')
        .order('required_points', { ascending: true });

      if (error) throw error;
      setAvailableVouchers(data || []);
    } catch (error: any) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const fetchUserVouchers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_vouchers')
        .select(`
          id,
          used_at,
          voucher:vouchers(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserVouchers(data || []);
    } catch (error: any) {
      console.error('Error fetching user vouchers:', error);
    }
  };

  const redeemVoucher = async (voucherId: string, requiredPoints: number) => {
    if (!profile || profile.green_points < requiredPoints) {
      toast({
        title: "Không đủ điểm",
        description: `Bạn cần ${requiredPoints} GreenPoint để đổi voucher này`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Add voucher to user
      const { error: voucherError } = await (supabase as any)
        .from('user_vouchers')
        .insert([
          {
            user_id: user?.id,
            voucher_id: voucherId
          }
        ]);

      if (voucherError) throw voucherError;

      // Deduct points from user
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({ green_points: profile.green_points - requiredPoints })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Đổi voucher thành công!",
        description: "Voucher đã được thêm vào ví của bạn",
      });

      fetchProfile();
      fetchUserVouchers();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể đổi voucher: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin...</p>
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
                  Xin chào, {profile?.first_name || 'Bạn'}!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Button>
          </div>

          {/* GreenPoint Wallet */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Ví GreenPoint
              </CardTitle>
              <CardDescription>
                Điểm thưởng từ việc mua sắm xanh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Coins className="w-8 h-8" />
                  {profile?.green_points || 0}
                </div>
                <div className="text-muted-foreground">
                  GreenPoint khả dụng
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Available Vouchers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Đổi Voucher
                </CardTitle>
                <CardDescription>
                  Sử dụng GreenPoint để đổi voucher giảm giá
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableVouchers.map((voucher) => (
                  <div key={voucher.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{voucher.name}</h3>
                        <p className="text-sm text-muted-foreground">{voucher.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        -{voucher.discount_percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {voucher.required_points} điểm
                      </span>
                      <Button
                        size="sm"
                        onClick={() => redeemVoucher(voucher.id, voucher.required_points)}
                        disabled={!profile || profile.green_points < voucher.required_points}
                      >
                        Đổi ngay
                      </Button>
                    </div>
                  </div>
                ))}
                {availableVouchers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Hiện tại chưa có voucher nào
                  </p>
                )}
              </CardContent>
            </Card>

            {/* My Vouchers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Voucher của tôi
                </CardTitle>
                <CardDescription>
                  Các voucher bạn đã đổi và có thể sử dụng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userVouchers.map((userVoucher) => (
                  <div
                    key={userVoucher.id}
                    className={`p-4 border border-border rounded-lg ${
                      userVoucher.used_at ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {userVoucher.voucher.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {userVoucher.voucher.description}
                        </p>
                      </div>
                      <Badge
                        variant={userVoucher.used_at ? "outline" : "default"}
                        className="ml-2"
                      >
                        -{userVoucher.voucher.discount_percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {userVoucher.used_at
                          ? `Đã sử dụng: ${new Date(userVoucher.used_at).toLocaleDateString()}`
                          : 'Có thể sử dụng'
                        }
                      </span>
                      {!userVoucher.used_at && (
                        <Badge variant="secondary">Khả dụng</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {userVouchers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Bạn chưa có voucher nào
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;