import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileSearch, Lock } from "lucide-react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { useToast } from "@/hooks/use-toast";

const AdminVerification = () => {
  const { products, verifyProduct } = useBusinessContext();
  const { toast } = useToast();
  
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const pendingProducts = products.filter(p => p.status === 'pending_verification');
  const historyProducts = products.filter(p => p.status === 'verified_pass' || p.status === 'verified_fail');

  const handleApprove = (id: string) => {
    verifyProduct(id, true);
    toast({
      title: "Đã xác thực thành công ✅",
      description: "Smart Contract đã tự động mở khóa 100% doanh thu cho Doanh nghiệp.",
      className: "bg-green-50 border-green-200"
    });
  };

  const handleReject = () => {
    if (!selectedProduct || !rejectReason) return;
    verifyProduct(selectedProduct, false, rejectReason);
    setRejectReason("");
    setSelectedProduct(null);
    toast({
      title: "Đã từ chối & Kích hoạt Refund ⚠️",
      description: "Hệ thống đang hoàn trả 90% Locked Pool lại cho ví của người tiêu dùng.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trung tâm Kiểm định CO2</h1>
            <p className="text-muted-foreground">Thẩm định tín chỉ carbon & Giải ngân quỹ đầu tư.</p>
          </div>
        </div>

        {/* SECTION: PENDING */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileSearch className="w-5 h-5" /> Hồ sơ chờ duyệt ({pendingProducts.length})
        </h2>
        
        <div className="grid gap-6 mb-12">
          {pendingProducts.length > 0 ? (
            pendingProducts.map(product => (
              <Card key={product.id} className="border-l-4 border-l-orange-400 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>ID: {product.id}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pending Audit</Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-1">Locked Pool (Tài sản đảm bảo)</p>
                      <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
                        <Lock className="w-5 h-5" /> {product.lockedRevenue.toLocaleString()} ₫
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-1">Dữ liệu CO2 khai báo</p>
                      <div className="text-2xl font-bold text-green-600">
                        {product.co2Saved} kg <span className="text-sm text-gray-400 font-normal">/ sp</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-500 mb-1">Số lượng bán ra</p>
                      <div className="text-2xl font-bold text-gray-800">{product.sales}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 flex justify-end gap-3 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setSelectedProduct(product.id)}>
                        <XCircle className="w-4 h-4 mr-2" /> Từ chối & Refund
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Xác nhận từ chối</DialogTitle>
                        <DialogDescription>
                          Hành động này sẽ kích hoạt Smart Contract để <strong>Hoàn tiền (Refund)</strong> cho toàn bộ người mua. Doanh nghiệp sẽ bị phạt.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Lý do từ chối:</label>
                        <Textarea 
                          placeholder="VD: Phát hiện khai khống số liệu nguyên liệu..." 
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="destructive" onClick={handleReject}>Xác nhận Refund</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(product.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Duyệt & Giải ngân
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed">Hiện không có hồ sơ nào cần duyệt.</div>
          )}
        </div>

        {/* SECTION: HISTORY */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử kiểm định</h2>
        <div className="space-y-4">
          {historyProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-white border rounded-lg opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <h4 className="font-bold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">
                  {product.status === 'verified_pass' ? 'Đã giải ngân: ' : 'Đã hoàn tiền: '} 
                  {(product.lockedRevenue * (product.status === 'verified_pass' ? 0.99 : 0.9)).toLocaleString()} ₫
                </p>
              </div>
              <Badge className={product.status === 'verified_pass' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                {product.status === 'verified_pass' ? 'Đạt chuẩn' : 'Gian lận'}
              </Badge>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default AdminVerification;