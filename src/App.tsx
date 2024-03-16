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

import './style.css';
import { Box, Card } from '@mui/material';
import { Component } from 'react';
import { Socket, io } from 'socket.io-client';
import ReactSpeedometer from 'react-d3-speedometer';
import { Chart } from 'react-google-charts';
import CircularProgress from '@mui/material/CircularProgress';
import StopwatchTimer from './stopwatchTimer';
import TrackView from './trackView';
import { LinearGauge, LinearGaugeProps } from '@progress/kendo-react-gauges';

const DATA_SOURCE = 'http://localhost:8080';
//const DATA_SOURCE = 'https://judas.arkinsolomon.net';

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: Socket;
  
  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [
        {velocity: 0, time: new Date(), distanceTraveled: 450, batteryVoltage: 0, engineTemp: 0, wind: 0, tilt: 0, latency: 0}
      ],
      currentRaceName: '<no race>'
    };
  }

  newRace(): void {
    this._socket?.emit('request_new_race');
  }

  componentDidMount(): void {
    this._socket = io(DATA_SOURCE, {
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
        <Box className='wait-screen'>
          <h1>Waiting for data...</h1>
          <CircularProgress />
        </Box>
      );
    }

    const linearOptions: LinearGaugeProps = {
      pointer : {
        value: 10
      },
      scale: {
        min: 0,
        max: 100,
        majorUnit: 20,
        minorUnit: 5,
        vertical: true
      }
    };

    return (
      <>
        <Box id='stopwatch'>
          <h2>Race: {this.state.currentRaceName}</h2>
          <StopwatchTimer />
        </Box>
        <Box id='main-box'>
          <Box id='primary-gauges'>
            <Card className='gauge-box'>
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
            <Card id='tiltometer'>
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
            <Card className='gauge-box'>
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
            <Card id='battery-card'>
              <LinearGauge
                {...linearOptions} />
              <h3>
                Battery Voltage
              </h3>
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px'}}>
            <Card>
              <TrackView trackName={'ShellTrackFixed'} distanceTraveled={this.state.history[0].distanceTraveled} />
            </Card>
            
            
          </Box>
        </Box>

        
      </>
    );
  }
}

