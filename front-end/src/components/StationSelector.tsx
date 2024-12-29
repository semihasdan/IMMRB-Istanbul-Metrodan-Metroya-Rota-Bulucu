import { Autocomplete, TextField, Grid } from '@mui/material';

interface Station {
  id: string;
  name: string;
  line: string;
  coordinates: [number, number];
}

interface StationSelectorProps {
  stations: Station[];
  onStartStationChange: (station: Station | null) => void;
  onEndStationChange: (station: Station | null) => void;
}

const StationSelector = ({
  stations,
  onStartStationChange,
  onEndStationChange,
}: StationSelectorProps) => {
  return (
    <Grid container spacing={2} sx={{ marginY: 2 }}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={stations}
          getOptionLabel={(option) => `${option.name} (${option.line})`}
          onChange={(_, value) => onStartStationChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Başlangıç İstasyonu"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={stations}
          getOptionLabel={(option) => `${option.name} (${option.line})`}
          onChange={(_, value) => onEndStationChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Varış İstasyonu"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default StationSelector; 