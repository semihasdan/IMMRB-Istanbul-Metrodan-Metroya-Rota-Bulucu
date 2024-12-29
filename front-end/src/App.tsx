import { useState } from 'react';
import RouteForm from './components/RouteForm';
import Map from './components/Map';

interface Station {
  name: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  line: string;
}

interface Route {
  path: Station[];
  distance: number;
  numberOfStations: number;
}

function App() {
  const [route, setRoute] = useState<Route | null>(null);

  const handleRouteFound = (newRoute: Route) => {
    setRoute(newRoute);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          İstanbul Metrodan Metroya Rota Bulucu
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <RouteForm onRouteFound={handleRouteFound} />
            {route && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Rota Bilgileri</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Toplam Mesafe:</span>{' '}
                    {route.distance.toFixed(2)} km
                    <span className="font-medium"> || Durak Sayısı:</span>{' '}
                    {route.numberOfStations}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Güzergah</h3>
                    <div className="space-y-2">
                      {route.path.map((station, index) => {
                        const isTransfer = index > 0 && station.line !== route.path[index - 1].line;
                        return (
                          <div key={index} className="flex items-start">
                            <div className="flex-grow">
                              <div className="font-medium">{index + 1}. {station.name} || {station.line}</div>
                              {isTransfer && (
                                <div className="text-orange-500 text-sm mt-1">
                                  ↳ Hat değişimi
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-2 rounded-lg shadow-lg h-[600px]">
              <Map route={route} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
