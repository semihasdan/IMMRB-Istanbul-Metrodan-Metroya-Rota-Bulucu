import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Map from '../components/Map';
import StationSelector from '../components/StationSelector';

interface Station {
  id: string;
  name: string;
  line: string;
  coordinates: [number, number];
}

// Örnek istasyon verileri (daha sonra API'den alınacak)
const sampleStations: Station[] = [
  {
    id: '1',
    name: 'Taksim',
    line: 'M2',
    coordinates: [41.0370, 28.9850],
  },
  {
    id: '2',
    name: 'Yenikapı',
    line: 'M2',
    coordinates: [41.0050, 28.9500],
  },
  // Daha fazla istasyon eklenecek
];

const HomePage = () => {
  const [startStation, setStartStation] = useState<Station | null>(null);
  const [endStation, setEndStation] = useState<Station | null>(null);

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          İstanbul Metro Rota Bulucu
        </Typography>
        <Typography variant="body1" gutterBottom>
          Başlangıç ve varış istasyonlarını seçerek en uygun rotayı bulun.
        </Typography>
        <StationSelector
          stations={sampleStations}
          onStartStationChange={setStartStation}
          onEndStationChange={setEndStation}
        />
      </Paper>
      <Map startStation={startStation} endStation={endStation} />
    </Box>
  );
};

export default HomePage; 