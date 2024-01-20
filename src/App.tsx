import { Box, Card } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import styleGauge from './styleGauge';


function App() {
  return (
    <Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <Card sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
          <GaugeChart id="gauge-chart1" nrOfLevels={40} percent={0.56} />
          <p> Wheel Speed </p>
        </Card>
        <Card sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <GaugeChart id="gauge-chart1" nrOfLevels={40} percent={0.56} />
          <p> Wheel Speed </p>
        </Card>
      </Box>
      
      <p>Hello world!</p>
    </Box>
  );
}

export default App;
