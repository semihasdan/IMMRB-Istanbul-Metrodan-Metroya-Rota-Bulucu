const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/routes';

interface Station {
    name: string;
    line: string;
    coordinates: [number, number];
}

interface APIStation {
    name: string;
    line: string;
    coordinates: {
        type: string;
        coordinates: [number, number];
    };
}

interface Route {
    path: Station[];
    distance: number;
    numberOfStations: number;
}

interface APIRoute {
    path: APIStation[];
    distance: number;
    numberOfStations: number;
}

export const api = {
    async getAllStations(): Promise<Station[]> {
        try {
            console.log('İstasyonlar getiriliyor...');
            const response = await fetch(`${API_BASE_URL}/stations`);
            console.log('API yanıtı:', response);
            
            if (!response.ok) {
                console.error('API hatası:', response.status, response.statusText);
                throw new Error('İstasyonlar alınamadı');
            }
            
            const data = await response.json();
            console.log('Alınan istasyonlar:', data);
            
            // API'den gelen veriyi dönüştür
            const stations: Station[] = data.stations.map((station: APIStation) => ({
                name: station.name,
                line: station.line,
                coordinates: station.coordinates.coordinates
            }));
            
            return stations;
        } catch (error) {
            console.error('İstasyon listesi hatası:', error);
            throw error;
        }
    },

    async findRoute(start: string, end: string): Promise<Route> {
        try {
            console.log('Rota aranıyor:', { start, end });
            const response = await fetch(
                `${API_BASE_URL}/find?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
            );
            
            if (!response.ok) {
                console.error('Rota bulunamadı:', response.status, response.statusText);
                throw new Error('Rota bulunamadı');
            }
            
            const data = await response.json();
            console.log('Bulunan rota:', data);
            
            // API'den gelen veriyi dönüştür
            const apiRoute = data.route as APIRoute;
            const route: Route = {
                path: apiRoute.path.map((station) => ({
                    name: station.name,
                    line: station.line,
                    coordinates: station.coordinates.coordinates
                })),
                distance: apiRoute.distance,
                numberOfStations: apiRoute.numberOfStations
            };
            
            return route;
        } catch (error) {
            console.error('Rota bulma hatası:', error);
            throw error;
        }
    },
}; 