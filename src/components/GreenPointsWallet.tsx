import { useEffect, useState } from "react";
import { Wallet, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  greenpoints: number;
}

const GreenPointsWallet = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('greenpoints')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Ví điểm GreenPoints</h2>
      </div>
      
      <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Coins className="w-5 h-5" />
            Số dư hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">
                {userData?.greenpoints || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                GreenPoints
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Mua sắm để tích điểm
              </div>
              <div className="text-xs text-primary font-medium">
                ✨ Đổi điểm lấy voucher
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GreenPointsWallet;