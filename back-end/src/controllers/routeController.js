const Station = require('../models/Station');
const RouteCalculator = require('../utils/RouteCalculator');

exports.findRoute = async (req, res) => {
    try {
        const { start, end } = req.query;
        
        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: 'Başlangıç ve bitiş istasyonları gereklidir.'
            });
        }

        // Tüm istasyonları getir
        const stations = await Station.find();
        
        // Rota hesaplayıcıyı başlat
        const calculator = new RouteCalculator(stations);
        
        // En kısa yolu hesapla
        const route = calculator.findShortestPath(start, end);
        
        // Rota bulunamadıysa
        if (!route || route.distance === Infinity) {
            return res.status(404).json({
                success: false,
                message: 'Bu istasyonlar arasında rota bulunamadı.'
            });
        }

        // Rota detaylarını oluştur
        const routeDetails = await Promise.all(route.path.map(async (stationName) => {
            const station = stations.find(s => s.name === stationName);
            return {
                name: station.name,
                coordinates: station.coordinates,
                line: station.line
            };
        }));

        res.json({
            success: true,
            route: {
                path: routeDetails,
                distance: route.distance,
                numberOfStations: route.path.length
            }
        });

    } catch (error) {
        console.error('Rota bulma hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Rota hesaplanırken bir hata oluştu.'
        });
    }
};

exports.getAllStations = async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({
            success: true,
            stations: stations.map(station => ({
                name: station.name,
                coordinates: station.coordinates,
                line: station.line
            }))
        });
    } catch (error) {
        console.error('İstasyon listesi hatası:', error);
        res.status(500).json({
            success: false,
            message: 'İstasyonlar listelenirken bir hata oluştu.'
        });
    }
}; 