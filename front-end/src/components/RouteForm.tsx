import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

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

interface RouteFormProps {
    onRouteFound: (route: Route) => void;
}

interface GroupedStations {
    [key: string]: Station[];
}

const RouteForm: React.FC<RouteFormProps> = ({ onRouteFound }) => {
    const [stations, setStations] = useState<Station[]>([]);
    const [groupedStations, setGroupedStations] = useState<GroupedStations>({});
    const [startStation, setStartStation] = useState('');
    const [endStation, setEndStation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStations, setLoadingStations] = useState(true);
    const [selectedStartLine, setSelectedStartLine] = useState('');
    const [selectedEndLine, setSelectedEndLine] = useState('');

    useEffect(() => {
        loadStations();
    }, []);

    useEffect(() => {
        const grouped = stations.reduce((acc: GroupedStations, station) => {
            if (!acc[station.line]) {
                acc[station.line] = [];
            }
            acc[station.line].push(station);
            return acc;
        }, {});

        Object.keys(grouped).forEach(line => {
            grouped[line].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        });

        setGroupedStations(grouped);
    }, [stations]);

    const loadStations = async () => {
        try {
            setLoadingStations(true);
            const stationList = await api.getAllStations();
            setStations(stationList);
            setError('');
        } catch {
            setError('İstasyonlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        } finally {
            setLoadingStations(false);
        }
    };

    const handleStartLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedStartLine(line);
        setStartStation('');
    };

    const handleEndLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedEndLine(line);
        setEndStation('');
    };

    const sortedLines = Object.keys(groupedStations).sort((a, b) => a.localeCompare(b, 'tr'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startStation || !endStation) {
            setError('Lütfen başlangıç ve varış istasyonlarını seçin.');
            return;
        }
        if (startStation === endStation) {
            setError('Başlangıç ve varış istasyonları aynı olamaz.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const route = await api.findRoute(startStation, endStation);
            onRouteFound(route);
            setError('');
        } catch {
            setError('Rota hesaplanırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingStations) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">İstasyonlar yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">İstanbul Metro Rota Bulucu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metro/Tramvay Hattı
                        </label>
                        <select
                            value={selectedStartLine}
                            onChange={handleStartLineChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Hat Seçin</option>
                            {sortedLines.map(line => (
                                <option key={line} value={line}>{line}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başlangıç İstasyonu
                        </label>
                        <select
                            value={startStation}
                            onChange={(e) => setStartStation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!selectedStartLine}
                            required
                        >
                            <option value="">İstasyon Seçin</option>
                            {selectedStartLine && groupedStations[selectedStartLine]?.map((station) => (
                                <option key={station.name} value={station.name}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metro/Tramvay Hattı
                        </label>
                        <select
                            value={selectedEndLine}
                            onChange={handleEndLineChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Hat Seçin</option>
                            {sortedLines.map(line => (
                                <option key={line} value={line}>{line}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Varış İstasyonu
                        </label>
                        <select
                            value={endStation}
                            onChange={(e) => setEndStation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!selectedEndLine}
                            required
                        >
                            <option value="">İstasyon Seçin</option>
                            {selectedEndLine && groupedStations[selectedEndLine]?.map((station) => (
                                <option key={station.name} value={station.name}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !startStation || !endStation}
                    className={`w-full py-3 px-4 text-white font-medium rounded-md transition-colors ${
                        loading || !startStation || !endStation
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span className="ml-2">Rota Hesaplanıyor...</span>
                        </div>
                    ) : (
                        'Rota Bul'
                    )}
                </button>
            </form>
        </div>
    );
};

export default RouteForm; 