export type DataEntry = {
  time: Date;
  velocity: number;
  distanceTraveled: number;
  batteryVoltage: number;
  engineTemp: number;
  wind: number;
  tilt: number;
}

export type HistoryData = DataEntry & { latency: number; };

export type AppState = {
  // latency is in ms
  history: HistoryData[];
  currentRaceName: string;
}

import { Box, Card } from '@mui/material';
import { Component } from 'react';
import { Socket, io } from 'socket.io-client';
import ReactSpeedometer from 'react-d3-speedometer';
import { Chart } from 'react-google-charts';
import StopwatchTimer from './stopwatchTimer';


export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: Socket;
  
  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [],
      currentRaceName: '<no race>'
    };
  }

  componentDidMount(): void {
    this._socket = io('https://judas.arkinsolomon.net', {
      autoConnect: false
    });
    this._socket.on('new_data', (data: (DataEntry | { time: string }) | HistoryData) => {
      data.time = new Date(data.time);
      (data as HistoryData & { latency?: number }).latency = Date.now() - data.time.valueOf();
      
      this.setState({
        history: [data as HistoryData, ...this.state.history]
      });
    });

    this._socket.on('new_race_created', name => {
      this.setState({
        history: [],
        currentRaceName: name
      });
    });

    this._socket.on('current_race', name => {
      this.setState({
        currentRaceName: name
      });
    });
    this._socket.connect();
  }

  componentWillUnmount(): void {
    this._socket?.disconnect();
  }

  render() {
    if (this.state.history.length === 0) {
      return (
        <h1>Waiting for data...</h1>
      );
    }

    return (
      <>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid lightgray'}}>
          <h1>Race: {this.state.currentRaceName}</h1>
          <StopwatchTimer />
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
            <Card sx={{ alignItems: 'center', padding: '20px'}}>
              <Chart
                chartType='Gauge'
                height='250px'
                loader={<div>Loading...</div>}
                data={[
                  ['Label', 'Value'],
                  ['Speed (MPH)', Math.round(this.state.history[0].velocity)]
                ]}
                options={{
                  minorTicks: 5,
                  max: 35,
                }}
              />
            </Card>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
              <ReactSpeedometer 
                maxValue={70}
                minValue={-70} 
                value={Math.round(this.state.history[0].tilt)} 
                segments={7}
                maxSegmentLabels={7} 
                currentValueText='${value} Degrees' 
                segmentColors={['red', 'red', 'yellow', 'green', 'yellow', 'red', 'red']} 
                height={180}
              />
            </Card>
            <Card sx={{ alignItems: 'center', padding: '20px'}}>
              <Chart
                chartType='Gauge'
                height='250px'
                loader={<div>Loading...</div>}
                data={[
                  ['Label', 'Value'],
                  ['Temp (F)', Math.round(this.state.history[0].engineTemp)]
                ]}
                options={{
                  redFrom: 180,
                  redTo: 200,
                  yellowFrom: 155,
                  yellowTo: 180,
                  minorTicks: 5,
                  max: 200,
                }}
              />
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px'}}>
            <Card sx={{width: '460px'}}>
              <h3>
                Track Map
              </h3>

            </Card>
            <Card sx={{width: '460px'}}>
              <h3>
                Battery Voltage
              </h3>
            </Card>
          </Box>
        </Box>

        
      </>
    );
  }
}

