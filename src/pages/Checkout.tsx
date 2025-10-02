import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bike, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryVehicle, setDeliveryVehicle] = useState('electric'); // 'bicycle' or 'electric'
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phoneNumber: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateAndAwardPoints = async (cartItems: any[], userId: string, orderId: string) => {
    try {
      let totalPointsEarned = 0;
      let totalCo2Saved = 0;

      // Get product details to calculate points
      for (const item of cartItems) {
        const { data: product, error: productError } = await (supabase as any)
          .from('products')
          .select('point, co2_emission')
          .eq('id', item.id)
          .single();

        if (product && !productError) {
          const pointsForItem = (Number(product.point) || 0) * item.quantity;
          const co2ForItem = (Number(product.co2_emission) || 0) * item.quantity;
          
          totalPointsEarned += pointsForItem;
          totalCo2Saved += co2ForItem;

          // Record transaction for each product
          await supabase
            .from('transactions')
            .insert({
              user_id: userId,
              product_id: item.id,
              amount: item.price * item.quantity,
              co2_saved: co2ForItem,
              greenpoints_earned: pointsForItem,
              note: `Mua ${item.quantity} x ${item.name}`
            });
        }
      }

      // Update user's total greenpoints
      if (totalPointsEarned > 0) {
        const { data: currentUser } = await supabase
          .from('users')
          .select('greenpoints')
          .eq('id', userId)
          .single();

        if (currentUser) {
          await supabase
            .from('users')
            .update({ 
              greenpoints: (currentUser.greenpoints || 0) + totalPointsEarned 
            })
            .eq('id', userId);
        }
      }

      return { totalPointsEarned, totalCo2Saved };
    } catch (error) {
      console.error('Error calculating and awarding points:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!formData.shippingAddress.trim() || !formData.phoneNumber.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ địa chỉ giao hàng và số điện thoại.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          shipping_address: formData.shippingAddress,
          phone_number: formData.phoneNumber,
          status: 'Chờ xác nhận'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Calculate and award GreenPoints
      const pointsResult = await calculateAndAwardPoints(items, user.id, order.id);
      
      // Add extra points for bicycle delivery
      if (deliveryVehicle === 'bicycle' && pointsResult) {
        const bonusPoints = 10;
        const { data: currentUser } = await supabase
          .from('users')
          .select('greenpoints')
          .eq('id', user.id)
          .single();

        if (currentUser) {
          await supabase
            .from('users')
            .update({ 
              greenpoints: (currentUser.greenpoints || 0) + bonusPoints 
            })
            .eq('id', user.id);
          
          // Record bonus transaction
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              greenpoints_earned: bonusPoints,
              co2_saved: 2.0,
              amount: 0,
              note: `Thưởng chọn giao hàng bằng xe đạp`
            });
        }
      }

      // Clear cart and show success message
      clearCart();
      setOrderSuccess(true);
      
      toast({
        title: "Đặt hàng thành công!",
        description: deliveryVehicle === 'bicycle' 
          ? "Bạn nhận thêm 10 GreenPoints khi chọn xe đạp! Đơn hàng sẽ được giao trong 2 tiếng."
          : "Đơn hàng của bạn đã được tạo thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after order
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="pt-6 pb-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Đặt hàng thành công!</h2>
                <p className="text-muted-foreground">
                  {deliveryVehicle === 'bicycle' 
                    ? "Cảm ơn bạn đã chọn giao hàng bằng xe đạp! Bạn đã nhận thêm 10 GreenPoints."
                    : "Đơn hàng của bạn đã được tạo. Chúng tôi sẽ liên hệ sớm nhất."}
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={() => navigate('/')} size="lg" className="w-full">
                    Quay về mua hàng tiếp
                  </Button>
                  <Button onClick={() => navigate('/profile')} variant="outline" size="lg" className="w-full">
                    Xem đơn hàng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Giỏ hàng của bạn đang trống</p>
            <Link to="/">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Địa chỉ giao hàng *</Label>
                    <Textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ đầy đủ..."
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại..."
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú (tuỳ chọn)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Chọn phương tiện giao hàng</Label>
                    <RadioGroup value={deliveryVehicle} onValueChange={setDeliveryVehicle} className="space-y-3">
                      <div className="flex items-start space-x-3 border-2 border-input rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="electric" id="electric" className="mt-1" />
                        <Label htmlFor="electric" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">Xe máy điện</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Giao hàng nhanh trong nội thành</p>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 border-2 border-primary rounded-lg p-4 cursor-pointer bg-green-50/50">
                        <RadioGroupItem value="bicycle" id="bicycle" className="mt-1" />
                        <Label htmlFor="bicycle" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Bike className="w-5 h-5 text-green-600" />
                            <span className="font-semibold">Xe đạp</span>
                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">+10 điểm</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Giao hàng chậm hơn 2 tiếng nhưng thân thiện môi trường</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;