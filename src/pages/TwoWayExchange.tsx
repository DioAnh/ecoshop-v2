import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Recycle, MapPin, TrendingDown } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryPoint {
  id: string;
  lat: number;
  lng: number;
  address: string;
  type: "delivery" | "collection";
  recycleCount: number;
}

interface CityData {
  name: string;
  center: [number, number];
  deliveryPoints: DeliveryPoint[];
  orders: number;
  wasteKg: number;
  co2Delivery: number;
  co2Saved: number;
}

const citiesData: Record<string, CityData> = {
  hanoi: {
    name: "Hà Nội",
    center: [21.0285, 105.8542],
    deliveryPoints: [
      { id: "d1", lat: 21.0285, lng: 105.8542, address: "Hoàn Kiếm", type: "delivery", recycleCount: 3 },
      { id: "d2", lat: 21.0245, lng: 105.8412, address: "Ba Đình", type: "delivery", recycleCount: 5 },
      { id: "c1", lat: 21.0365, lng: 105.8345, address: "Trung tâm phân loại Hà Nội", type: "collection", recycleCount: 0 },
      { id: "d3", lat: 21.0185, lng: 105.8642, address: "Hai Bà Trưng", type: "delivery", recycleCount: 2 },
      { id: "d4", lat: 21.0125, lng: 105.8512, address: "Đống Đa", type: "delivery", recycleCount: 4 },
    ],
    orders: 145,
    wasteKg: 320,
    co2Delivery: 85.5,
    co2Saved: 124.8,
  },
  hcm: {
    name: "TP. Hồ Chí Minh",
    center: [10.8231, 106.6297],
    deliveryPoints: [
      { id: "d1", lat: 10.8231, lng: 106.6297, address: "Quận 1", type: "delivery", recycleCount: 6 },
      { id: "d2", lat: 10.8131, lng: 106.6197, address: "Quận 3", type: "delivery", recycleCount: 4 },
      { id: "c1", lat: 10.8331, lng: 106.6397, address: "Trung tâm phân loại HCM", type: "collection", recycleCount: 0 },
      { id: "d3", lat: 10.8031, lng: 106.6097, address: "Quận 5", type: "delivery", recycleCount: 5 },
      { id: "d4", lat: 10.8431, lng: 106.6497, address: "Bình Thạnh", type: "delivery", recycleCount: 7 },
    ],
    orders: 289,
    wasteKg: 645,
    co2Delivery: 172.3,
    co2Saved: 251.4,
  },
  danang: {
    name: "Đà Nẵng",
    center: [16.0544, 108.2022],
    deliveryPoints: [
      { id: "d1", lat: 16.0544, lng: 108.2022, address: "Hải Châu", type: "delivery", recycleCount: 3 },
      { id: "c1", lat: 16.0644, lng: 108.2122, address: "Trung tâm phân loại Đà Nẵng", type: "collection", recycleCount: 0 },
      { id: "d2", lat: 16.0444, lng: 108.1922, address: "Thanh Khê", type: "delivery", recycleCount: 2 },
    ],
    orders: 98,
    wasteKg: 215,
    co2Delivery: 57.2,
    co2Saved: 83.8,
  },
  haiphong: {
    name: "Hải Phòng",
    center: [20.8449, 106.6881],
    deliveryPoints: [
      { id: "d1", lat: 20.8449, lng: 106.6881, address: "Hồng Bàng", type: "delivery", recycleCount: 2 },
      { id: "c1", lat: 20.8549, lng: 106.6981, address: "Trung tâm phân loại Hải Phòng", type: "collection", recycleCount: 0 },
      { id: "d2", lat: 20.8349, lng: 106.6781, address: "Lê Chân", type: "delivery", recycleCount: 3 },
    ],
    orders: 76,
    wasteKg: 168,
    co2Delivery: 44.6,
    co2Saved: 65.5,
  },
  cantho: {
    name: "Cần Thơ",
    center: [10.0452, 105.7469],
    deliveryPoints: [
      { id: "d1", lat: 10.0452, lng: 105.7469, address: "Ninh Kiều", type: "delivery", recycleCount: 2 },
      { id: "c1", lat: 10.0552, lng: 105.7569, address: "Trung tâm phân loại Cần Thơ", type: "collection", recycleCount: 0 },
      { id: "d2", lat: 10.0352, lng: 105.7369, address: "Cái Răng", type: "delivery", recycleCount: 1 },
    ],
    orders: 54,
    wasteKg: 118,
    co2Delivery: 31.4,
    co2Saved: 46.0,
  },
  binhduong: {
    name: "Bình Dương",
    center: [10.9804, 106.6519],
    deliveryPoints: [
      { id: "d1", lat: 10.9804, lng: 106.6519, address: "Thủ Dầu Một", type: "delivery", recycleCount: 4 },
      { id: "c1", lat: 10.9904, lng: 106.6619, address: "Trung tâm phân loại Bình Dương", type: "collection", recycleCount: 0 },
      { id: "d2", lat: 10.9704, lng: 106.6419, address: "Dĩ An", type: "delivery", recycleCount: 3 },
    ],
    orders: 112,
    wasteKg: 248,
    co2Delivery: 65.9,
    co2Saved: 96.6,
  },
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
  const [selectedCity, setSelectedCity] = useState<string>("hanoi");
  const cityData = citiesData[selectedCity];

  const totalOrders = Object.values(citiesData).reduce((sum, city) => sum + city.orders, 0);
  const totalDeliveryPoints = Object.values(citiesData).reduce(
    (sum, city) => sum + city.deliveryPoints.filter((p) => p.type === "delivery").length,
    0
  );
  const totalCO2Saved = Object.values(citiesData).reduce((sum, city) => sum + city.co2Saved, 0);
  const totalCO2Delivery = Object.values(citiesData).reduce((sum, city) => sum + city.co2Delivery, 0);
  const totalNetCO2 = totalCO2Delivery - totalCO2Saved;

  const deliveryIcon = L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const collectionIcon = L.divIcon({
    className: "custom-icon",
    html: `<div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const routes = cityData.deliveryPoints
    .filter((p) => p.type === "delivery")
    .map((p) => {
      const collection = cityData.deliveryPoints.find((c) => c.type === "collection");
      if (collection) {
        return [
          [p.lat, p.lng],
          [collection.lat, collection.lng],
        ] as [number, number][];
      }
      return null;
    })
    .filter(Boolean) as [number, number][][];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Quy đổi 2 chiều</h1>
          <p className="text-muted-foreground">Giao hàng xanh & Thu gom tái chế</p>
        </div>

        {/* City Filter */}
        <div className="mb-6">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(citiesData).map(([key, city]) => (
                <SelectItem key={key} value={key}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Map Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Bản đồ giao hàng & thu gom - {cityData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={cityData.center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Routes */}
                {routes.map((route, idx) => (
                  <Polyline 
                    key={idx} 
                    positions={route} 
                    pathOptions={{ color: "#9ca3af", weight: 2, dashArray: "5, 10" }} 
                  />
                ))}

                {/* Markers */}
                {cityData.deliveryPoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={[point.lat, point.lng]}
                    icon={point.type === "delivery" ? deliveryIcon : collectionIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{point.address}</p>
                        <p className="text-muted-foreground">
                          {point.type === "delivery" ? "Điểm giao hàng" : "Trung tâm phân loại"}
                        </p>
                        {point.type === "delivery" && (
                          <p className="text-green-600 font-medium mt-1">
                            +{point.recycleCount} đơn tái chế
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Map Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng chuyến</p>
                      <p className="text-2xl font-bold text-foreground">{cityData.orders}</p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Số điểm giao</p>
                      <p className="text-2xl font-bold text-foreground">
                        {cityData.deliveryPoints.filter((p) => p.type === "delivery").length}
                      </p>
                    </div>
                    <MapPin className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CO₂ tiết kiệm</p>
                      <p className="text-2xl font-bold text-green-600">
                        {cityData.co2Saved.toFixed(1)} kg
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
                <div className="w-8 h-0.5 bg-gray-400" style={{ borderTop: "2px dashed" }}></div>
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
                    return (
                      <tr key={key} className="border-b hover:bg-muted/50 transition-colors">
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
                      </tr>
                    );
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
    </div>
  );
}
