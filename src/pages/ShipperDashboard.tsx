import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Recycle, PackageCheck, Truck, CheckCircle2, ScanLine, Scale, Coins, History } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

const PENDING_ORDERS = [
  { id: "ORD-001", name: "Nguyen Thi Mo", address: "123 Le Loi, D1", cod: 250000, type: "EV Delivery", eco: 2 },
  { id: "ORD-002", name: "Tran Van Buoi", address: "456 Nguyen Hue, D1", cod: 0, type: "Bicycle", eco: 5 },
  { id: "ORD-003", name: "Le Thi Tao", address: "789 Pastuer, D3", cod: 120000, type: "Motorbike", eco: -2 },
];

const ShipperDashboard = () => {
  const { ecoBalance, recycleLogs, addRecycleItem, processRecyclingBatch } = useWalletContext();
  const { toast } = useToast();
  const [orders, setOrders] = useState(PENDING_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isCollectDialogOpen, setIsCollectDialogOpen] = useState(false);
  const [wasteType, setWasteType] = useState("plastic");
  const [wasteWeight, setWasteWeight] = useState("");

  const handleDeliverSuccess = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setIsCollectDialogOpen(true);
    
    toast({
      title: "Delivery Successful! 🎉",
      description: `Earned ${order?.eco} ECO for green delivery.`,
      className: "bg-green-50 border-green-200"
    });
  };

  const handleConfirmCollect = () => {
    if (!wasteWeight || parseFloat(wasteWeight) <= 0) return;
    addRecycleItem(selectedOrder.name, wasteType, parseFloat(wasteWeight));
    setIsCollectDialogOpen(false);
    setWasteWeight(""); 
    toast({
      title: "Collection Confirmed ♻️",
      description: `Collected ${wasteWeight}kg of waste. Return to depot to claim rewards.`,
      className: "bg-emerald-50 border-emerald-200"
    });
  };

  const handleCheckInWarehouse = () => {
    const pendingItems = recycleLogs?.filter(log => log.status === 'collected') || [];
    const totalReward = pendingItems.reduce((sum, item) => sum + item.ecoEarned, 0) * 0.2; 
    processRecyclingBatch();
    toast({
      title: "Depot Check-in Successful 🏭",
      description: `You earned ${totalReward.toFixed(2)} ECO service fee. Remaining reward distributed to Consumer.`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const safeRecycleLogs = recycleLogs || [];
  const pendingRecycleCount = safeRecycleLogs.filter(l => l.status === 'collected').length;
  const pendingRecycleWeight = safeRecycleLogs.filter(l => l.status === 'collected').reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Card className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Available Income</p>
                  <h3 className="text-3xl font-bold">{ecoBalance ? ecoBalance.toFixed(2) : '0.00'} ECO</h3>
                  <p className="text-xs text-blue-200 mt-1">≈ {(ecoBalance * 1000).toLocaleString()} VND</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg"><Truck className="w-6 h-6 text-white" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-800 text-sm font-medium mb-1">Waste On-board</p>
                  <h3 className="text-3xl font-bold text-emerald-900">{pendingRecycleWeight.toFixed(1)} kg</h3>
                  <p className="text-xs text-emerald-700 mt-1">{pendingRecycleCount} items</p>
                </div>
                <div className="p-2 bg-emerald-200 rounded-lg"><Recycle className="w-6 h-6 text-emerald-700" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="delivery" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white shadow-sm border">
            <TabsTrigger value="delivery" className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-bold">
              Delivery ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="recycle" className="text-base data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 font-bold">
              Recycling Depot ({pendingRecycleCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4 w-full">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600 font-bold h-12 w-12 flex items-center justify-center shrink-0">
                        <PackageCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-lg">{order.name}</h4>
                          <Badge variant="outline" className="text-xs">{order.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.address}</p>
                        <div className="flex gap-2 pt-1">
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">COD: {order.cod.toLocaleString()}đ</Badge>
                          <Badge className={`border-none ${order.eco > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {order.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleDeliverSuccess(order.id)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-10 px-6 font-bold shadow-sm">
                      Delivered
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border border-dashed">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>All deliveries completed!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recycle" className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800"><Scale className="w-5 h-5" /> Current Waste Batch</CardTitle>
                <CardDescription>Check-in at the depot to convert waste to ECO tokens.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safeRecycleLogs.filter(l => l.status === 'collected').length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {safeRecycleLogs.filter(l => l.status === 'collected').map((log) => (
                        <div key={log.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-full"><Recycle className="w-4 h-4 text-emerald-600" /></div>
                            <div>
                              <p className="font-bold text-sm">{log.customerName}</p>
                              <p className="text-xs text-gray-500 capitalize">{log.wasteType} • {log.weight} kg</p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-600 text-sm">+{log.ecoEarned} ECO</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500 py-4 italic">No waste collected yet.</p>
                  )}

                  <div className="border-t border-dashed border-emerald-200 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Weight</p>
                      <p className="text-2xl font-bold text-gray-800">{pendingRecycleWeight} kg</p>
                    </div>
                    <Button size="lg" onClick={handleCheckInWarehouse} disabled={pendingRecycleCount === 0} className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200">
                      <ScanLine className="w-5 h-5 mr-2" /> Check-in Depot
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-xl border p-4">
              <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <History className="w-4 h-4" /> Processed History
              </h4>
              <div className="space-y-2">
                {safeRecycleLogs.filter(l => l.status === 'processed').map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0 border-gray-100">
                    <span className="text-sm text-gray-600">{new Date(log.date).toLocaleTimeString()} - {log.customerName}</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500">Processed</Badge>
                  </div>
                ))}
                {safeRecycleLogs.filter(l => l.status === 'processed').length === 0 && <p className="text-xs text-gray-400 text-center">No history yet.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isCollectDialogOpen} onOpenChange={setIsCollectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-700"><Recycle className="w-5 h-5" /> Collect Recyclables</DialogTitle>
              <DialogDescription>Did customer <strong>{selectedOrder?.name}</strong> return any recyclables?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm font-medium">Type</span>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic">Plastic / Bottles</SelectItem>
                    <SelectItem value="paper">Paper / Carton</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="can">Aluminum / Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm font-medium">Weight</span>
                <div className="col-span-3 relative">
                  <Input type="number" placeholder="0.0" value={wasteWeight} onChange={(e) => setWasteWeight(e.target.value)} className="pr-10"/>
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">kg</span>
                </div>
              </div>
              {wasteWeight && (
                <div className="col-span-4 bg-emerald-50 p-3 rounded-lg flex items-center justify-between border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-medium">Est. Reward:</span>
                  <span className="text-sm font-bold text-emerald-800 flex items-center gap-1"><Coins className="w-4 h-4" /> {parseFloat(wasteWeight) * 10} ECO</span>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between gap-2">
              <Button variant="ghost" onClick={() => setIsCollectDialogOpen(false)}>No Waste</Button>
              <Button onClick={handleConfirmCollect} className="bg-emerald-600 hover:bg-emerald-700">Confirm Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ShipperDashboard;