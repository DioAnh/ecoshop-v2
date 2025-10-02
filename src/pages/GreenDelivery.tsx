import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bike, Truck, TreePine, Clock, MapPin, Award, Recycle } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GreenDelivery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recycleWeight, setRecycleWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecycleSubmit = async () => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để quy đổi điểm",
        variant: "destructive",
      });
      return;
    }

    const weight = parseFloat(recycleWeight);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Số liệu không hợp lệ",
        description: "Vui lòng nhập số kg hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pointsEarned = Math.floor(weight * 10); // 1kg = 10 điểm
      const co2Saved = weight * 2.5; // Giả sử 1kg rác tái chế = 2.5kg CO2 tiết kiệm

      // Lấy greenpoints hiện tại của user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('greenpoints')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Cập nhật greenpoints
      const newGreenpoints = (userData?.greenpoints || 0) + pointsEarned;
      const { error: updateError } = await supabase
        .from('users')
        .update({ greenpoints: newGreenpoints })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Tạo transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          greenpoints_earned: pointsEarned,
          co2_saved: co2Saved,
          amount: weight,
          note: `Quy đổi ${weight}kg rác thải tái chế`,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Quy đổi thành công!",
        description: `Bạn đã nhận ${pointsEarned} GreenPoints từ ${weight}kg rác thải tái chế`,
      });

      setRecycleWeight('');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi quy đổi điểm",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Bike className="w-8 h-8 text-primary" />
              Giao hàng xanh
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dịch vụ giao hàng thân thiện với môi trường, góp phần giảm phát thải carbon và bảo vệ hành tinh
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Bike className="w-5 h-5" />
                  Xe máy điện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  100% xe máy điện, không khí thải, giảm 85% phát thải CO2 so với xe xăng truyền thống
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  Giao hàng nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  Giao hàng trong 2-4 giờ trong nội thành, cam kết đúng giờ và an toàn
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <MapPin className="w-5 h-5" />
                  Phủ sóng rộng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-600">
                  Phủ sóng toàn bộ TP.HCM và Hà Nội, mở rộng ra các tỉnh thành khác
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <TreePine className="w-5 h-5" />
                  Tác động môi trường
                </CardTitle>
                <CardDescription>
                  Những con số ấn tượng về việc bảo vệ môi trường
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600 font-medium">CO2 tiết kiệm</p>
                    <p className="text-2xl font-bold text-green-700">1,250 kg</p>
                  </div>
                  <TreePine className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Đơn hàng xanh</p>
                    <p className="text-2xl font-bold text-blue-700">12,500</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Km không khí thải</p>
                    <p className="text-2xl font-bold text-purple-700">45,000 km</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Truck className="w-5 h-5" />
                  Quy trình giao hàng
                </CardTitle>
                <CardDescription>
                  Từ kho hàng đến tay khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Xác nhận đơn hàng</h4>
                      <p className="text-sm text-muted-foreground">
                        Hệ thống tự động xác nhận và chuẩn bị đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Tối ưu lộ trình</h4>
                      <p className="text-sm text-muted-foreground">
                        AI tính toán lộ trình ngắn nhất, tiết kiệm năng lượng
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Giao hàng xanh</h4>
                      <p className="text-sm text-muted-foreground">
                        Shipper sử dụng xe máy điện giao hàng đến tận nơi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Hoàn thành</h4>
                      <p className="text-sm text-muted-foreground">
                        Tích điểm GreenPoints cho mỗi đơn hàng xanh
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recycle Exchange Section */}
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Recycle className="w-6 h-6" />
                Quy đổi chai nhựa & rác thải tái chế
              </CardTitle>
              <CardDescription>
                Đổi rác thải tái chế lấy GreenPoints - 1kg = 10 điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Rác thải được chấp nhận:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Chai nhựa (PET, HDPE)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Giấy, bìa carton
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Lon nhôm, kim loại
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Thủy tinh
                    </li>
                  </ul>
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Tỷ lệ quy đổi</span>
                      <span className="text-2xl font-bold text-green-700">1kg = 10 điểm</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mỗi 1kg rác tái chế giúp giảm ~2.5kg phát thải CO₂
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Quy đổi ngay:</h4>
                  <div className="space-y-4 p-4 bg-white rounded-lg border border-green-200">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Số kg rác thải tái chế
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Nhập số kg (VD: 2.5)"
                        value={recycleWeight}
                        onChange={(e) => setRecycleWeight(e.target.value)}
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
                    {recycleWeight && parseFloat(recycleWeight) > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          Bạn sẽ nhận được: <span className="font-bold">{Math.floor(parseFloat(recycleWeight) * 10)} GreenPoints</span>
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Giảm phát thải: ~{(parseFloat(recycleWeight) * 2.5).toFixed(2)} kg CO₂
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleRecycleSubmit}
                      disabled={isSubmitting || !recycleWeight || parseFloat(recycleWeight) <= 0}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Xác nhận quy đổi'}
                    </Button>
                    {!user && (
                      <p className="text-xs text-center text-amber-600">
                        Vui lòng đăng nhập để quy đổi điểm
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">Lợi ích của giao hàng xanh</CardTitle>
              <CardDescription className="text-center">
                Cùng nhau xây dựng tương lai bền vững
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TreePine className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Giảm phát thải</h4>
                  <p className="text-sm text-muted-foreground">
                    Giảm 85% khí thải CO2 so với phương tiện truyền thống
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Tích điểm xanh</h4>
                  <p className="text-sm text-muted-foreground">
                    Nhận thêm GreenPoints cho mỗi đơn hàng giao bằng xe điện
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Giao hàng nhanh</h4>
                  <p className="text-sm text-muted-foreground">
                    Xe máy điện linh hoạt, giao hàng nhanh chóng trong thành phố
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Chi phí tối ưu</h4>
                  <p className="text-sm text-muted-foreground">
                    Tiết kiệm chi phí vận chuyển nhờ hiệu quả năng lượng cao
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GreenDelivery;