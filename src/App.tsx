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
import { LinearGauge, LinearGaugeProps } from '@progress/kendo-react-gauges';
import { motion } from 'framer-motion';


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
        <Box className='wait-screen'>
          <h1>Waiting for data...</h1>
          <CircularProgress />
        </Box>
      );
    }

    const transition = {duration: 4, yoyo: Infinity, ease: 'easeInOut'};

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
              <h3>
                Track Map
              </h3>
              <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" baseProfile="tiny" version="1.1">
                <g>
                  <title>Layer 1</title>
                  <motion.path 
                    transform="rotate(90, 400, 300)"
                    id="svg_3" 
                    d="m226.99,419.04l0,-14.96l-0.45,-26.31l0,-7.7l-0.46,-17.24l0,-0.9l0,-14.52l-0.45,-12.69l0,-3.63l0,-19.5l-0.45,-27.21l-0.46,-20.86l0,-21.77l-0.45,-2.27l0,-14.06l0,-18.59l-0.45,-5.9l-0.46,-2.26l-0.45,-3.18l-0.45,-25.85l-0.46,-3.17l0,-21.32l0,-0.45l0.46,-15.87l0.45,-18.14l10.88,-0.46l15.42,0l4.08,-0.45l3.63,-0.45l2.72,-0.46l2.72,-1.36l0.46,0l2.26,-1.36l2.27,-1.81l1.82,-1.36l1.36,-1.36l1.81,-2.72l0.91,-2.27l0.45,-2.27l0,-4.53l0,-3.63l-2.27,-17.69l0.91,-1.81l0.45,-1.36l0.91,-3.63l1.36,-3.63l0.91,-2.72l1.36,-3.63l2.27,-3.17l1.81,-2.72l1.36,-1.82l2.72,-2.72l3.18,-3.17l2.72,-2.27l2.72,-1.81l3.17,-2.27l3.18,-1.81l3.17,-1.37l4.08,-1.81l2.72,-0.91l7.26,-2.72l15.87,-5.89l4.08,-1.36l1.82,-0.46l2.27,-0.45l1.81,0l1.81,0l3.63,0.45l3.63,1.36l4.08,1.36l2.27,1.36l1.81,1.37l2.27,1.36l1.36,1.36l2.72,2.26l1.82,2.27l1.81,2.27l1.36,3.63l1.36,3.17l0.45,4.08l0.46,37.19l0,6.8l0,1.36l-0.46,1.36l-0.45,1.82l-0.45,1.36l-0.46,1.36l-1.81,2.72l12.24,4.99l3.18,1.81l3.17,2.27l2.72,2.27l2.72,3.17l0.91,0.45l3.63,4.09l0.91,34.92l0.9,52.15l0,4.53l0.46,16.78l0,15.87l1.36,40.82l0,0.91l0.9,78l0,2.72l0.46,33.1l-0.46,16.33l3.18,3.63l2.27,1.81l2.26,1.82l4.54,2.26l3.63,1.36l4.53,0.91l3.18,0.45l4.08,0.46l15.42,-0.91l14.06,0l2.26,0l1.82,0l3.62,0.91l4.09,1.36l4.53,1.81l2.72,1.82l2.27,1.81l2.72,2.72l1.36,1.82l1.36,2.26l0.91,2.72l0.91,2.27l1.81,3.18l1.81,1.81l2.72,2.27l2.27,1.81l2.72,1.36l3.18,1.36l3.17,0.91l3.63,0.45l3.63,0l0.91,0l37.18,-2.27l3.63,0l2.72,0l1.36,0l2.72,0.91l2.27,1.36l1.36,0.91l1.36,1.36l1.36,1.36l1.82,3.17l1.81,3.63l2.27,4.99l0.9,4.08l1.36,5.44l0.46,5.9l-0.46,6.8l-0.9,4.54l-1.82,8.61l-1.36,6.81l-1.81,9.07l-1.36,7.71l-1.82,9.97l-2.72,10.89l-0.45,2.26l-0.45,0.91l-1.36,3.63l-1.82,4.08l-0.45,0l-2.27,4.08l-6.35,9.07l-5.89,7.71l-0.46,0.46l-6.8,3.62l-8.62,4.99l-4.98,2.27l-5.45,2.27l-2.26,0.9l-4.09,1.36l-4.53,1.36l-6.35,1.37l-5.44,0.9l-0.45,0l-8.17,1.36l-9.52,0.91l-6.35,0.45l-17.69,0l-31.74,0.46l-21.32,0l-4.08,0l-4.53,0.45l-5.9,-0.45l-4.99,-0.46l-3.62,0l0.45,-16.32l0.45,-22.22l0.91,-3.63l0.45,-1.36l0,-1.36l0,-0.91l0,-1.36l-0.9,-2.72l-0.91,-1.82l-0.91,-1.81l-0.9,-1.36l-1.37,-1.36l-1.36,-1.81l-1.81,-1.37l-1.81,-2.26l-1.82,-0.91l-17.68,5.44l-33.56,10.43l-4.99,1.36l-5.9,0.91l-4.53,0.45l-4.54,0.46l-4.99,-0.46l-4.98,-0.45l-6.81,-0.91l-2.72,-0.45l-3.17,-0.91l-4.54,-1.36l-2.26,-0.9l-1.36,-0.46l-4.09,-2.27l-4.53,-2.26l-4.54,-2.72l-2.26,-2.27l-2.27,-1.82l-3.18,-2.72l-3.17,-4.53l-2.72,-3.63l-0.45,-0.45l-1.82,-2.72l-2.27,-4.99l-2.72,-5.44l-5.44,-12.25l0,-6.8l0,-1.36l-0.45,-27.67l0,-0.9l-0.46,-27.21l-0.45,-13.61z"
                    fill="lightgray"
                    strokeWidth="12"
                    stroke="rgba(255, 2, 255, 0.69)"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={transition}
                  />
                </g>
              </svg>
            </Card>
            
            
          </Box>
        </Box>

        
      </>
    );
  }
}

