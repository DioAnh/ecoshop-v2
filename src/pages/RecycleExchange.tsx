import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coins, Wine, PackageOpen, FileText, GlassWater, Package } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RecycleMaterial {
  id: string;
  name: string;
  icon: any;
  pointsPerUnit: number;
  unit: string;
  color: string;
  bgColor: string;
}

interface RecycleHistory {
  id: string;
  material: string;
  quantity: number;
  pointsEarned: number;
  date: string;
}

const RecycleExchange = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [greenPoints, setGreenPoints] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<RecycleMaterial | null>(null);
  const [quantity, setQuantity] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<RecycleHistory[]>([]);

  const materials: RecycleMaterial[] = [
    {
      id: 'plastic',
      name: 'Chai nhựa',
      icon: Wine,
      pointsPerUnit: 2,
      unit: 'cái',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'aluminum',
      name: 'Lon nhôm',
      icon: PackageOpen,
      pointsPerUnit: 3,
      unit: 'cái',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
    },
    {
      id: 'paper',
      name: 'Giấy',
      icon: FileText,
      pointsPerUnit: 1,
      unit: 'kg',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    },
    {
      id: 'glass',
      name: 'Thủy tinh',
      icon: GlassWater,
      pointsPerUnit: 2,
      unit: 'kg',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    },
    {
      id: 'other',
      name: 'Bao bì khác',
      icon: Package,
      pointsPerUnit: 1,
      unit: 'cái',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
  ];

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchHistory();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('greenpoints')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setGreenPoints(data?.greenpoints || 0);
    } catch (error: any) {
      console.error('Error fetching points:', error);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedHistory: RecycleHistory[] = (data || []).map((t) => ({
        id: t.id.toString(),
        material: t.note || 'Quy đổi ve chai',
        quantity: t.amount || 0,
        pointsEarned: t.greenpoints_earned || 0,
        date: new Date(t.created_at).toLocaleDateString('vi-VN'),
      }));

      setHistory(formattedHistory);
    } catch (error: any) {
      console.error('Error fetching history:', error);
    }
  };

  const handleMaterialClick = (material: RecycleMaterial) => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để quy đổi ve chai",
        variant: "destructive",
      });
      return;
    }
    setSelectedMaterial(material);
    setQuantity('');
    setIsDialogOpen(true);
  };

  const handleConfirmExchange = async () => {
    if (!selectedMaterial || !user) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Số liệu không hợp lệ",
        description: `Vui lòng nhập số ${selectedMaterial.unit} hợp lệ`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pointsEarned = Math.floor(qty * selectedMaterial.pointsPerUnit);
      const co2Saved = qty * 0.5; // Giả sử mỗi đơn vị tiết kiệm 0.5kg CO2

      // Lấy greenpoints hiện tại
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
          amount: qty,
          note: `${selectedMaterial.name} - ${qty} ${selectedMaterial.unit}`,
        });

      if (transactionError) throw transactionError;

      // Cập nhật UI
      setGreenPoints(newGreenpoints);
      
      toast({
        title: "Bạn đã quy đổi thành công!",
        description: `Nhận được ${pointsEarned} GreenPoints từ ${qty} ${selectedMaterial.unit} ${selectedMaterial.name.toLowerCase()}`,
      });

      setIsDialogOpen(false);
      setQuantity('');
      setSelectedMaterial(null);
      
      // Refresh history
      fetchHistory();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi quy đổi",
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground">
                Quy đổi ve chai nhận GreenPoint
              </h1>
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-none">
                <CardContent className="p-4 flex items-center gap-3">
                  <Coins className="w-8 h-8 text-white" />
                  <div className="text-white">
                    <p className="text-sm opacity-90">Điểm của bạn</p>
                    <p className="text-2xl font-bold">{greenPoints} điểm</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {materials.map((material) => {
              const Icon = material.icon;
              return (
                <Card
                  key={material.id}
                  className={`${material.bgColor} border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
                  onClick={() => handleMaterialClick(material)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-white flex items-center justify-center ${material.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className={`font-bold text-lg mb-1 ${material.color}`}>
                      {material.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {material.pointsPerUnit} điểm/{material.unit}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Lịch sử quy đổi</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có lịch sử quy đổi
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.material}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+{item.pointsEarned} điểm</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exchange Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMaterial && (
                <>
                  <selectedMaterial.icon className={`w-5 h-5 ${selectedMaterial.color}`} />
                  Quy đổi {selectedMaterial.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedMaterial && (
                <>
                  Nhập số lượng {selectedMaterial.unit} bạn muốn quy đổi.
                  <br />
                  Bạn sẽ nhận được {selectedMaterial.pointsPerUnit} điểm cho mỗi {selectedMaterial.unit}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Số lượng ({selectedMaterial?.unit})
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder={`Nhập số ${selectedMaterial?.unit}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-lg"
              />
            </div>
            {quantity && parseFloat(quantity) > 0 && selectedMaterial && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Bạn sẽ nhận được:{' '}
                  <span className="font-bold text-lg">
                    {Math.floor(parseFloat(quantity) * selectedMaterial.pointsPerUnit)} GreenPoints
                  </span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmExchange}
              disabled={isSubmitting || !quantity || parseFloat(quantity) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận quy đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecycleExchange;
