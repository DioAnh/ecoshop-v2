import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export const VietnamMap = ({ citiesData, selectedCity }: VietnamMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [106.5, 16.0], // Center of Vietnam
      zoom: 5.5,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Add markers after map loads
    map.current.on('load', () => {
      setIsMapLoaded(true);
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add city markers
      Object.entries(citiesData).forEach(([key, city]) => {
        const netCo2 = city.co2Delivery - city.co2Saved;
        const markerColor = getMarkerColor(netCo2);

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = markerColor;
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.3s ease';

        // Add hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.3)';
          el.style.zIndex = '1000';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        // Highlight selected city
        if (selectedCity === key) {
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
          el.style.border = '4px solid #3b82f6';
        }

        // Create popup content
        const popupContent = `
          <div style="font-family: system-ui; padding: 4px;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #1f2937;">${city.name}</h3>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Đơn hàng:</span>
                <span style="font-weight: 600; color: #1f2937;">${city.orders}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Điểm giao:</span>
                <span style="font-weight: 600; color: #10b981;">${city.deliveryPoints}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">CO₂ giao:</span>
                <span style="font-weight: 600; color: #f59e0b;">${city.co2Delivery.toFixed(1)} kg</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">CO₂ tiết kiệm:</span>
                <span style="font-weight: 600; color: #10b981;">${city.co2Saved.toFixed(1)} kg</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb;">
                <span style="color: #6b7280;">CO₂ ròng:</span>
                <span style="font-weight: 700; color: ${netCo2 > 0 ? '#ef4444' : '#10b981'};">
                  ${netCo2 > 0 ? '+' : ''}${netCo2.toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          maxWidth: '280px'
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(city.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        markers.current.push(marker);
      });
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [citiesData, selectedCity, mapboxToken]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {!mapboxToken ? (
        <div className="p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Nhập Mapbox Access Token</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Để hiển thị bản đồ, vui lòng nhập Mapbox public token của bạn. 
            Bạn có thể lấy token tại <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijoi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setMapboxToken(mapboxToken)}>
              Tải bản đồ
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[500px]">
          <div ref={mapContainer} className="absolute inset-0" />
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-muted-foreground">Đang tải bản đồ...</p>
            </div>
          )}
      
          {/* Color Legend */}
          {isMapLoaded && (
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
          )}
        </div>
      )}
    </div>
  );
};
