import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Map from '../components/Map';
import StationSelector from '../components/StationSelector';

interface Station {
  name: string;
  line: string;
  coordinates: [number, number];
}

const HomePage = () => {
  const [startStation, setStartStation] = useState<Station | null>(null);
  const [endStation, setEndStation] = useState<Station | null>(null);
  const [route, setRoute] = useState(null);

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
          onStartStationChange={setStartStation}
          onEndStationChange={setEndStation}
        />
      </Paper>
      <Map startStation={startStation} endStation={endStation} route={route} />
    </Box>
  );
};

export default HomePage; 