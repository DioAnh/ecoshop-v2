import { useState } from 'react';
import vietnamMap from '@/assets/vietnam-map-clean.png';

interface CityData {
  name: string;
  orders: number;
  wasteKg: number;
  co2Delivery: number;
  co2Saved: number;
  deliveryPoints: number;
  coordinates: [number, number];
}

interface VietnamMapProps {
  citiesData: Record<string, CityData>;
  selectedCity?: string;
}

const getMarkerColor = (netCo2: number): string => {
  if (netCo2 <= 0) return '#10b981'; // green-500
  if (netCo2 <= 20) return '#f59e0b'; // orange-500
  return '#ef4444'; // red-500
};

// Relative positions for cities on the map (percentage-based)
const cityPositions: Record<string, { top: string; left: string }> = {
  hanoi: { top: '22%', left: '52%' },
  haiphong: { top: '24%', left: '58%' },
  danang: { top: '48%', left: '58%' },
  hcm: { top: '82%', left: '54%' },
  binhduong: { top: '78%', left: '54%' },
  cantho: { top: '88%', left: '50%' }
};

export const VietnamMap = ({ citiesData, selectedCity }: VietnamMapProps) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <div className="relative w-full h-[500px] bg-muted/20">
        <img 
          src={vietnamMap} 
          alt="Bản đồ Việt Nam" 
          className="w-full h-full object-contain"
        />
        
        {/* City Markers */}
        {Object.entries(citiesData).map(([key, city]) => {
          const netCo2 = city.co2Delivery - city.co2Saved;
          const markerColor = getMarkerColor(netCo2);
          const position = cityPositions[key];
          const isSelected = selectedCity === key;
          const isHovered = hoveredCity === key;

          return (
            <div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{
                top: position.top,
                left: position.left,
                zIndex: isSelected || isHovered ? 1000 : 1
              }}
              onMouseEnter={() => setHoveredCity(key)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div
                className="rounded-full border-white shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: markerColor,
                  width: isSelected ? '32px' : '24px',
                  height: isSelected ? '32px' : '24px',
                  borderWidth: isSelected ? '4px' : '3px',
                  boxShadow: isSelected 
                    ? '0 0 20px rgba(59, 130, 246, 0.6)' 
                    : '0 2px 8px rgba(0,0,0,0.3)',
                  borderColor: isSelected ? '#3b82f6' : 'white',
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                }}
              />
              
              {/* Tooltip */}
              {isHovered && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white rounded-lg shadow-xl p-3 text-sm z-[1001]"
                  style={{ pointerEvents: 'none' }}
                >
                  <h3 className="font-semibold text-base mb-2 text-foreground">{city.name}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Đơn hàng:</span>
                      <span className="font-semibold text-foreground">{city.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Điểm giao:</span>
                      <span className="font-semibold text-green-600">{city.deliveryPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO₂ giao:</span>
                      <span className="font-semibold text-orange-600">{city.co2Delivery.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO₂ tiết kiệm:</span>
                      <span className="font-semibold text-green-600">{city.co2Saved.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between pt-1 mt-1 border-t border-border">
                      <span className="text-muted-foreground">CO₂ ròng:</span>
                      <span className={`font-bold ${netCo2 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {netCo2 > 0 ? '+' : ''}{netCo2.toFixed(1)} kg
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Color Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-foreground mb-2">Mức CO₂ ròng</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-muted-foreground">Tốt (≤0 kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-muted-foreground">Trung bình (1-20 kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-muted-foreground">Cao (&gt;20 kg)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
