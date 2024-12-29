class RouteCalculator {
    constructor(stations) {
        this.stations = stations;
        this.graph = this._buildGraph();
        this.transferStations = this._findTransferStations();
    }

    _buildGraph() {
        const graph = new Map();
        
        // Her istasyon için komşuları bulma
        this.stations.forEach(station => {
            if (!graph.has(station.name)) {
                graph.set(station.name, new Map());
            }
        });

        // İstasyonları bağla
        this.stations.forEach(station => {
            this.stations.forEach(neighbor => {
                if (station.name === neighbor.name) return;

                // Aynı hat üzerindeki istasyonları bağla
                if (station.line === neighbor.line) {
                    const distance = this._calculateDistance(
                        station.coordinates.coordinates,
                        neighbor.coordinates.coordinates
                    );
                    graph.get(station.name).set(neighbor.name, {
                        distance,
                        type: 'direct',
                        line: station.line
                    });
                }

                // Transfer istasyonlarını bağla (aynı konumda farklı hatlar)
                else if (this._areStationsClose(
                    station.coordinates.coordinates,
                    neighbor.coordinates.coordinates,
                    0.2 // 200 metre tolerans
                )) {
                    const transferPenalty = 5; // Transfer için 5 dakika ek süre
                    graph.get(station.name).set(neighbor.name, {
                        distance: transferPenalty,
                        type: 'transfer',
                        fromLine: station.line,
                        toLine: neighbor.line
                    });
                }
            });
        });

        return graph;
    }

    _findTransferStations() {
        const transferPoints = new Map();
        
        this.stations.forEach(station1 => {
            this.stations.forEach(station2 => {
                if (station1.name !== station2.name && 
                    station1.line !== station2.line && 
                    this._areStationsClose(
                        station1.coordinates.coordinates,
                        station2.coordinates.coordinates,
                        0.2
                    )) {
                    if (!transferPoints.has(station1.name)) {
                        transferPoints.set(station1.name, new Set());
                    }
                    if (!transferPoints.has(station2.name)) {
                        transferPoints.set(station2.name, new Set());
                    }
                    transferPoints.get(station1.name).add(station2.line);
                    transferPoints.get(station2.name).add(station1.line);
                }
            });
        });

        return transferPoints;
    }

    _areStationsClose(coord1, coord2, maxDistanceKm) {
        return this._calculateDistance(coord1, coord2) <= maxDistanceKm;
    }

    _calculateDistance(coord1, coord2) {
        const [lon1, lat1] = coord1;
        const [lon2, lat2] = coord2;
        
        const R = 6371; // Dünya'nın yarıçapı (km)
        const dLat = this._toRad(lat2 - lat1);
        const dLon = this._toRad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    _toRad(value) {
        return value * Math.PI / 180;
    }

    findShortestPath(start, end) {
        const distances = new Map();
        const previous = new Map();
        const previousEdge = new Map();
        const nodes = new Set();
        
        // Başlangıç değerlerini ayarlama
        this.graph.forEach((_, node) => {
            distances.set(node, Infinity);
            nodes.add(node);
        });
        distances.set(start, 0);
        
        while(nodes.size > 0) {
            // En küçük mesafeli düğümü bul
            let minNode = Array.from(nodes).reduce((min, node) => 
                !min || distances.get(node) < distances.get(min) ? node : min
            , null);
            
            if(minNode === null || minNode === end) break;
            
            nodes.delete(minNode);
            const currentDistance = distances.get(minNode);
            
            // Komşuları kontrol et
            for(let [neighbor, edge] of this.graph.get(minNode)) {
                let additionalCost = 0;
                
                // Transfer maliyetini hesapla
                if (edge.type === 'transfer') {
                    const prevEdge = previousEdge.get(minNode);
                    if (prevEdge && prevEdge.line !== edge.fromLine) {
                        additionalCost = 5; // Transfer cezası
                    }
                }

                const distance = currentDistance + edge.distance + additionalCost;
                
                if(distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, minNode);
                    previousEdge.set(neighbor, edge);
                }
            }
        }
        
        // Rotayı oluştur
        const path = [];
        let current = end;
        
        while(current !== undefined) {
            const station = this.stations.find(s => s.name === current);
            if (station) {
                path.unshift(station);
            }
            current = previous.get(current);
        }

        // Rota detaylarını hazırla
        const routeDetails = {
            path,
            distance: distances.get(end),
            numberOfStations: path.length,
            transfers: this._calculateTransfers(path),
            estimatedTime: this._calculateEstimatedTime(path, distances.get(end))
        };

        return routeDetails;
    }

    _calculateTransfers(path) {
        const transfers = [];
        let currentLine = path[0].line;
        
        for (let i = 1; i < path.length; i++) {
            if (path[i].line !== currentLine) {
                transfers.push({
                    station: path[i].name,
                    fromLine: currentLine,
                    toLine: path[i].line
                });
                currentLine = path[i].line;
            }
        }
        
        return transfers;
    }

    _calculateEstimatedTime(path, totalDistance) {
        const averageSpeed = 40; // km/saat
        const stationStopTime = 0.5; // dakika
        const transferTime = 5; // dakika
        
        // Mesafeye göre süre (saat)
        const travelTime = totalDistance / averageSpeed;
        
        // İstasyon duruş süreleri
        const stationStops = (path.length - 1) * stationStopTime;
        
        // Transfer süreleri
        const transfers = this._calculateTransfers(path);
        const transferTimes = transfers.length * transferTime;
        
        // Toplam süre (dakika)
        return Math.round(travelTime * 60 + stationStops + transferTimes);
    }
}

module.exports = RouteCalculator; 