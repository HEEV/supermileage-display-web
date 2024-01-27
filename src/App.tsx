/* eslint-disable linebreak-style */
export type DataEntry = {
  time: Date;
  velocity: number;
  distanceTraveled: number;
  batteryVoltage: number;
  engineTemp: number;
  wind: number;
  tilt: number;
}

export type AppState = {
  history: DataEntry[];
  currentRaceName: string;
}

import { Box, Card } from '@mui/material';
import { Component } from 'react';
import { Socket, io } from 'socket.io-client';
import ReactSpeedometer from 'react-d3-speedometer';
import { Chart } from 'react-google-charts';

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: Socket;
  
  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [{
        time: new Date,
        velocity: 5,
        distanceTraveled: 200,
        batteryVoltage: 1.2,
        engineTemp: 55,
        wind: 150,
        tilt: 45,
      }
      ],
      currentRaceName: '<no race>'
    };
  }

  componentDidMount(): void {
    this._socket = io('https://judas.arkinsolomon.net', {
      autoConnect: false
    });
    this._socket.on('new_data', data => {
      this.setState({
        history: [data, ...this.state.history]
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
    return (
      <>
        <h1>Race: {this.state.currentRaceName}</h1>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px'}}>
              <Chart
                chartType='Gauge'
                height='400px'
                loader={<div>Loading...</div>}
                data={[
                  ['Label', 'Value'],
                  ['Speed (MPH)', this.state.history[0].velocity]
                ]}
                options={{
                  minorTicks: 5,
                  max: 35,
                }}
              />
            </Card>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <ReactSpeedometer 
                maxValue={70}
                minValue={-70} 
                value={this.state.history[0].tilt} 
                segments={7}
                maxSegmentLabels={7} 
                currentValueText='${value} Degrees' 
                segmentColors={['red', 'red', 'yellow', 'green', 'yellow', 'red', 'red']} 
              />
            </Card>
            <Card>
              <Chart
                chartType='Gauge'
                height='400px'
                loader={<div>Loading...</div>}
                data={[
                  ['Label', 'Value'],
                  ['Temp (F)', this.state.history[0].engineTemp]
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
          <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
            <Card>
              <h3>
                Track Map
              </h3>

            </Card>
          </Box>
        </Box>

        
      </>
    );
  }
}

