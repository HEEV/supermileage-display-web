import { Card } from '@mui/material';
import GaugeChart from 'react-gauge-chart';

export default function styleGauge() {
  return (
    <Card sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <GaugeChart id="gauge-chart1" nrOfLevels={40} percent={0.56} />
      <p> Wheel Speed </p>
    </Card>
  );
}