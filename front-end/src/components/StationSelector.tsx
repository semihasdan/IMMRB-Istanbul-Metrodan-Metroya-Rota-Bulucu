import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { api } from '../services/api';

interface Station {
  name: string;
  line: string;
  coordinates: [number, number];
}

interface StationSelectorProps {
  onStartStationChange: (station: Station | null) => void;
  onEndStationChange: (station: Station | null) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  onStartStationChange,
  onEndStationChange,
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [startStation, setStartStation] = useState<string>('');
  const [endStation, setEndStation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationData = await api.getAllStations();
        setStations(stationData);
        setLoading(false);
      } catch (err) {
        setError('İstasyonlar yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleStartStationChange = (value: string) => {
    setStartStation(value);
    const station = stations.find(s => s.name === value) || null;
    onStartStationChange(station);
  };

  const handleEndStationChange = (value: string) => {
    setEndStation(value);
    const station = stations.find(s => s.name === value) || null;
    onEndStationChange(station);
  };

  if (loading) return <div>İstasyonlar yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <FormControl fullWidth>
        <InputLabel>Başlangıç İstasyonu</InputLabel>
        <Select
          value={startStation}
          label="Başlangıç İstasyonu"
          onChange={(e) => handleStartStationChange(e.target.value)}
        >
          {stations.map((station) => (
            <MenuItem key={station.name} value={station.name}>
              {station.name} ({station.line})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Varış İstasyonu</InputLabel>
        <Select
          value={endStation}
          label="Varış İstasyonu"
          onChange={(e) => handleEndStationChange(e.target.value)}
        >
          {stations.map((station) => (
            <MenuItem key={station.name} value={station.name}>
              {station.name} ({station.line})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StationSelector; 