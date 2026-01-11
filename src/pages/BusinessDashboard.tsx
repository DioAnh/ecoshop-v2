import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, Users, Leaf, DollarSign, Lock, AlertTriangle, Plus, Factory, Calculator, PlayCircle } from "lucide-react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const BusinessDashboard = () => {
  const { products, lockedPoolTotal, carbonCreditsTotal, availableMaterials, calculateImpact, addProduct, simulateSale } = useBusinessContext();
  const { toast } = useToast();

  // State cho Form thêm sản phẩm
  const [isOpen, setIsOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [materialWeight, setMaterialWeight] = useState("");
  
  // State tính toán AI
  const [aiPrediction, setAiPrediction] = useState({ co2: 0, tokens: 0 });

  // Xử lý khi thay đổi input để AI tính toán realtime
  const handleMaterialChange = (val: string) => {
    setSelectedMaterial(val);
    if (materialWeight) {
      setAiPrediction(calculateImpact(val, parseFloat(materialWeight)));
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = e.target.value;
    setMaterialWeight(w);
    if (selectedMaterial && w) {
      setAiPrediction(calculateImpact(selectedMaterial, parseFloat(w)));
    }
  };

  const handleCreateProduct = () => {
    if (!newProdName || !newProdPrice || !selectedMaterial || !materialWeight) return;

    const newProduct = {
      id: `prod_${Date.now()}`,
      name: newProdName,
      price: parseFloat(newProdPrice),
      greenMaterialId: selectedMaterial,
      materialWeight: parseFloat(materialWeight),
      co2Saved: aiPrediction.co2,
      tokenGenerated: aiPrediction.tokens,
      status: 'active' as const,
      sales: 0,
      lockedRevenue: 0
    };

    addProduct(newProduct);
    setIsOpen(false);
    resetForm();
    toast({
      title: "Đăng sản phẩm thành công! 🌱",
      description: "Sản phẩm đã được đưa lên chuỗi giá trị và bắt đầu tích lũy Locked Pool.",
      className: "bg-emerald-50 border-emerald-200"
    });
  };

  const resetForm = () => {
    setNewProdName(""); setNewProdPrice(""); setSelectedMaterial(""); setMaterialWeight(""); setAiPrediction({ co2: 0, tokens: 0 });
  };

  const handleSimulateSale = (id: string) => {
    simulateSale(id);
    toast({ title: "Bán hàng giả lập +1", description: "Doanh thu đã được chuyển vào Locked Pool." });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Green Farm Co. Dashboard</h1>
            <p className="text-muted-foreground">Quản lý chuỗi giá trị và tài sản xanh.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                <Plus className="w-4 h-4 mr-2" /> Đăng sản phẩm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Khai báo Chuỗi giá trị & Đăng bán</DialogTitle>
                <DialogDescription>Nhập thông tin nguyên liệu tái chế đầu vào để AI tính toán Micro-carbon Credit.</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên sản phẩm</Label>
                    <Input placeholder="VD: Túi vải từ sợi dứa" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Giá bán (VND)</Label>
                    <Input type="number" placeholder="0" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} />
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Factory className="w-4 h-4" /> Nguồn nguyên liệu đầu vào</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Chọn phế phẩm từ đối tác:</Label>
                        <Select value={selectedMaterial} onValueChange={handleMaterialChange}>
                          <SelectTrigger><SelectValue placeholder="Chọn nguồn..." /></SelectTrigger>
                          <SelectContent>
                            {availableMaterials.map(m => (
                              <SelectItem key={m.id} value={m.id}>{m.name} - {m.source}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Khối lượng sử dụng (kg/sản phẩm):</Label>
                        <Input type="number" step="0.1" placeholder="0.0" value={materialWeight} onChange={handleWeightChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI SIMULATOR PANEL */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 flex flex-col justify-center text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold mb-2">
                    <Calculator className="w-5 h-5" /> AI Impact Simulator
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-bold">CO2 Cắt giảm</p>
                      <p className="text-2xl font-bold text-green-600">{aiPrediction.co2} kg</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-bold">Token Z tạo ra</p>
                      <p className="text-2xl font-bold text-indigo-600">{aiPrediction.tokens}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 italic mt-2">
                    *Dữ liệu được tính toán dựa trên hệ số phát thải LCA (Life Cycle Assessment) của từng loại nguyên liệu.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleCreateProduct} className="w-full bg-emerald-600">Xác nhận & Đăng bán</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu (GMV)</p>
              <h3 className="text-2xl font-bold text-gray-900">{(1200000000 + (lockedPoolTotal * 10)).toLocaleString()} ₫</h3>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-orange-700">Lợi nhuận đang khóa (Pool)</p>
                <Lock className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-orange-900">{lockedPoolTotal.toLocaleString()} VND</h3>
              <p className="text-xs text-orange-600 mt-1">~10% Doanh thu giữ lại</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500">Carbon Credit (Micro)</p>
              <h3 className="text-2xl font-bold text-gray-900">{carbonCreditsTotal.toFixed(2)} Tín chỉ</h3>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500">Sản phẩm Active</p>
              <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">Sản phẩm & Chuỗi cung ứng</TabsTrigger>
            <TabsTrigger value="verification">Kiểm định & Mở khóa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const material = availableMaterials.find(m => m.id === product.greenMaterialId);
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-50 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Leaf className="w-3 h-3 text-green-500" /> Nguyên liệu: {material?.name}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Giá bán</p>
                          <p className="font-bold">{product.price.toLocaleString()} ₫</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Đã bán</p>
                          <p className="font-bold">{product.sales}</p>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <div className="flex justify-between items-center text-xs text-orange-700 mb-1">
                          <span>Locked Pool (10%)</span>
                          <Lock className="w-3 h-3" />
                        </div>
                        <div className="text-xl font-bold text-orange-800">{product.lockedRevenue.toLocaleString()} ₫</div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleSimulateSale(product.id)}>
                        <PlayCircle className="w-4 h-4 mr-2" /> Giả lập bán hàng (+1)
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="mt-6">
             <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 flex gap-4 items-start mb-6">
               <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
               <div>
                 <h4 className="font-bold text-yellow-800">Cảnh báo rủi ro</h4>
                 <p className="text-sm text-yellow-700">Nếu không đạt kiểm định CO2 vào cuối kỳ, 90% số token trong Pool sẽ được hoàn trả cho Consumers. 10% sẽ thuộc về nền tảng.</p>
               </div>
             </div>
             
             {/* Mock bảng kiểm định */}
             <Card>
               <CardHeader><CardTitle>Lịch sử kiểm định</CardTitle></CardHeader>
               <CardContent>
                 <div className="text-center py-10 text-muted-foreground">
                   Chưa đến kỳ kiểm định (Q4/2024).
                 </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BusinessDashboard;