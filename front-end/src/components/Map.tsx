import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapStation, MapRoute } from '../types';

interface MapProps {
  route: MapRoute | null;
  startStation: MapStation | null;
  endStation: MapStation | null;
}

const Map: React.FC<MapProps> = ({ route, startStation, endStation }) => {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([41.0082, 28.9784], 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      routeLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current || !route) return;

    routeLayerRef.current.clearLayers();

    const coordinates = route.path.map(station => [
      station.coordinates[1],
      station.coordinates[0]
    ] as [number, number]);

    L.polyline(coordinates, {
      color: '#1976d2',
      weight: 4,
      opacity: 0.8
    }).addTo(routeLayerRef.current);

    route.path.forEach((station, index) => {
      const isEndpoint = index === 0 || index === route.path.length - 1;
      const isTransfer = index > 0 && index < route.path.length - 1 && 
                        station.line !== route.path[index - 1].line;
      
      let markerColor = '#1976d2';
      if (isEndpoint) markerColor = '#dc004e';
      if (isTransfer) markerColor = '#ff9800';

      const marker = L.circleMarker(
        [station.coordinates[1], station.coordinates[0]],
        {
          radius: isEndpoint ? 10 : isTransfer ? 8 : 6,
          fillColor: markerColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }
      );

      let popupContent = `
        <div class="station-popup">
          <h3 class="font-bold text-lg mb-1">${station.name}</h3>
          <p class="text-sm text-gray-600">${station.line}</p>
      `;

      if (isEndpoint) {
        popupContent += `<p class="text-sm font-semibold mt-1">${index === 0 ? 'Başlangıç İstasyonu' : 'Varış İstasyonu'}</p>`;
      }
      
      if (isTransfer) {
        popupContent += `<p class="text-sm text-orange-600 mt-1">Transfer İstasyonu</p>`;
      }

      if (index < route.path.length - 1) {
        const nextStation = route.path[index + 1];
        popupContent += `
          <div class="mt-2 text-sm">
            <p>Sonraki İstasyon: ${nextStation.name}</p>
            <p class="text-gray-600">${nextStation.line}</p>
          </div>
        `;
      }

      popupContent += '</div>';

      marker.bindPopup(popupContent, {
        className: 'station-popup',
        maxWidth: 300
      });

      if (routeLayerRef.current) {
        marker.addTo(routeLayerRef.current);
      }
    });

    const bounds = L.latLngBounds(coordinates);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [route]);

  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    // Başlangıç istasyonunu göster
    if (startStation) {
      const startMarker = L.circleMarker(
        [startStation.coordinates[1], startStation.coordinates[0]],
        {
          radius: 10,
          fillColor: '#dc004e',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }
      );

      startMarker.bindPopup(`
        <div class="station-popup">
          <h3 class="font-bold text-lg mb-1">${startStation.name}</h3>
          <p class="text-sm text-gray-600">${startStation.line}</p>
          <p class="text-sm font-semibold mt-1">Başlangıç İstasyonu</p>
        </div>
      `).addTo(routeLayerRef.current);
    }

    // Varış istasyonunu göster
    if (endStation) {
      const endMarker = L.circleMarker(
        [endStation.coordinates[1], endStation.coordinates[0]],
        {
          radius: 10,
          fillColor: '#dc004e',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }
      );

      endMarker.bindPopup(`
        <div class="station-popup">
          <h3 class="font-bold text-lg mb-1">${endStation.name}</h3>
          <p class="text-sm text-gray-600">${endStation.line}</p>
          <p class="text-sm font-semibold mt-1">Varış İstasyonu</p>
        </div>
      `).addTo(routeLayerRef.current);
    }

    // Haritayı istasyonlara göre ortala
    if (startStation && endStation) {
      const bounds = L.latLngBounds([
        [startStation.coordinates[1], startStation.coordinates[0]],
        [endStation.coordinates[1], endStation.coordinates[0]]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [startStation, endStation]);

  const renderFooter = () => {
    return (
      <div className="text-center text-xs text-gray-400 mt-8 pb-4">
        <p>
          Geliştirici:{' '}
          <a 
            href="https://github.com/semihasdan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            Semih Aşdan
          </a>
          {' • '}
          <a 
            href="https://www.linkedin.com/in/semihasdan/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            LinkedIn
          </a>
            - Rotayı kullanmadan önce lütfen kontrol ediniz.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative bg-white rounded-xl shadow-lg p-4">
        <div id="map" style={{ height: '600px', width: '100%' }} className="rounded-lg" />
      </div>
      {renderFooter()}
    </div>
  );
};

export default Map; 