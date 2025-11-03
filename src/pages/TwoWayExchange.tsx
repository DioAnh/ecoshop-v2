import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Recycle, MapPin, TrendingDown, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateDeliveryModal from "@/components/CreateDeliveryModal";
import CameraCapture from "@/components/CameraCapture";
import { supabase } from "@/integrations/supabase/client";
import { VietnamMap } from "@/components/VietnamMap";
import Header from "@/components/Header";
interface CityData {
  name: string;
  orders: number;
  wasteKg: number;
  co2Delivery: number;
  co2Saved: number;
  deliveryPoints: number;
  coordinates: [number, number]; // [longitude, latitude]
}
const citiesData: Record<string, CityData> = {
  hanoi: {
    name: "Hà Nội",
    orders: 145,
    wasteKg: 320,
    co2Delivery: 85.5,
    co2Saved: 124.8,
    deliveryPoints: 4,
    coordinates: [105.8542, 21.0285]
  },
  haiphong: {
    name: "Hải Phòng",
    orders: 76,
    wasteKg: 168,
    co2Delivery: 44.6,
    co2Saved: 65.5,
    deliveryPoints: 2,
    coordinates: [106.6881, 20.8449]
  },
  danang: {
    name: "Đà Nẵng",
    orders: 98,
    wasteKg: 215,
    co2Delivery: 57.2,
    co2Saved: 83.8,
    deliveryPoints: 2,
    coordinates: [108.2022, 16.0544]
  },
  hcm: {
    name: "TP. Hồ Chí Minh",
    orders: 289,
    wasteKg: 645,
    co2Delivery: 172.3,
    co2Saved: 251.4,
    deliveryPoints: 4,
    coordinates: [106.6297, 10.8231]
  },
  binhduong: {
    name: "Bình Dương",
    orders: 112,
    wasteKg: 248,
    co2Delivery: 65.9,
    co2Saved: 96.6,
    deliveryPoints: 2,
    coordinates: [106.6500, 11.3254]
  },
  cantho: {
    name: "Cần Thơ",
    orders: 54,
    wasteKg: 118,
    co2Delivery: 31.4,
    co2Saved: 46.0,
    deliveryPoints: 2,
    coordinates: [105.7851, 10.0452]
  }
};
const getEmissionColor = (netCo2: number) => {
  if (netCo2 <= 0) return "text-green-600 bg-green-50";
  if (netCo2 <= 20) return "text-yellow-600 bg-yellow-50";
  if (netCo2 <= 50) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
};
const getEmissionLabel = (netCo2: number) => {
  if (netCo2 <= 0) return "Tốt";
  if (netCo2 <= 20) return "Trung bình";
  if (netCo2 <= 50) return "Cao";
  return "Rất cao";
};
export default function TwoWayExchange() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("hanoi");
  const [refreshKey, setRefreshKey] = useState(0);
  const cityData = citiesData[selectedCity];
  const handleDeliverySuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  const totalOrders = Object.values(citiesData).reduce((sum, city) => sum + city.orders, 0);
  const totalDeliveryPoints = Object.values(citiesData).reduce((sum, city) => sum + city.deliveryPoints, 0);
  const totalCO2Saved = Object.values(citiesData).reduce((sum, city) => sum + city.co2Saved, 0);
  const totalCO2Delivery = Object.values(citiesData).reduce((sum, city) => sum + city.co2Delivery, 0);
  const totalNetCO2 = totalCO2Delivery - totalCO2Saved;
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Button>
              <h1 className="text-4xl font-bold text-foreground">Quy đổi 2 chiều</h1>
            </div>
            <p className="text-muted-foreground">Giao hàng xanh & Thu gom tái chế</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CreateDeliveryModal onSuccess={handleDeliverySuccess} />
            <CameraCapture />
          </div>
        </div>

        {/* City Filter */}
        <div className="mb-6">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(citiesData).map(([key, city]) => <SelectItem key={key} value={key}>
                  {city.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Map Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Bản đồ giao hàng & thu gom Việt Nam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VietnamMap citiesData={citiesData} selectedCity={selectedCity} />

            {/* Map Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng chuyến</p>
                      <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng điểm giao</p>
                      <p className="text-2xl font-bold text-foreground">{totalDeliveryPoints}</p>
                    </div>
                    <MapPin className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng CO₂ tiết kiệm</p>
                      <p className="text-2xl font-bold text-green-600">
                        {totalCO2Saved.toFixed(1)} kg
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Điểm giao hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Trung tâm phân loại</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gray-400" style={{
                borderTop: "2px dashed"
              }}></div>
                <span className="text-sm text-muted-foreground">Tuyến vận chuyển</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Heat Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-primary" />
              Bảng nhiệt phát thải CO₂
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="text-xl font-bold text-foreground">{totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ giao hàng</p>
                  <p className="text-xl font-bold text-orange-600">{totalCO2Delivery.toFixed(1)} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ tiết kiệm</p>
                  <p className="text-xl font-bold text-green-600">{totalCO2Saved.toFixed(1)} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ ròng</p>
                  <p className={`text-xl font-bold ${totalNetCO2 > 0 ? "text-red-600" : "text-green-600"}`}>
                    {totalNetCO2 > 0 ? "+" : ""}{totalNetCO2.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Heat Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Thành phố</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Đơn hàng</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Rác thu (kg)</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">CO₂ giao (kg)</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">CO₂ tiết kiệm (kg)</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">CO₂ ròng (kg)</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Mức độ</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(citiesData).map(([key, city]) => {
                  const netCo2 = city.co2Delivery - city.co2Saved;
                  return <tr key={key} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{city.name}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{city.orders}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{city.wasteKg}</td>
                        <td className="py-3 px-4 text-right text-orange-600">{city.co2Delivery.toFixed(1)}</td>
                        <td className="py-3 px-4 text-right text-green-600">{city.co2Saved.toFixed(1)}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${netCo2 > 0 ? "text-red-600" : "text-green-600"}`}>
                          {netCo2 > 0 ? "+" : ""}{netCo2.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEmissionColor(netCo2)}`}>
                            {getEmissionLabel(netCo2)}
                          </span>
                        </td>
                      </tr>;
                })}
                </tbody>
              </table>
            </div>

            {/* Legend for Heat Levels */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Tốt (≤0 kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-yellow-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Trung bình (1-20 kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-50 border border-orange-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Cao (21-50 kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Rất cao (&gt;50 kg)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-way Mechanism Info */}
        <Card className="mt-8 border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Cơ chế 2 chiều</h3>
                <p className="text-muted-foreground mb-3">
                  Mỗi lần giao hàng, bạn có thể quy đổi vật liệu tái chế (giấy, nhựa, lon, chai lọ) thành GreenPoint.
                  Điểm tích lũy sẽ được hiển thị trong Dashboard và liên kết với bảng xếp hạng.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">📄 Giấy: 2 điểm/kg</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">♻️ Nhựa: 3 điểm/kg</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">🥫 Lon: 4 điểm/kg</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">🍾 Chai lọ: 3 điểm/kg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}