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
import GaugeChart from 'react-gauge-chart';
import { Component } from 'react';
import { Socket/*, io */} from 'socket.io-client';

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
    return;
    //   this._socket = io('http://localhost:38392', {
    //     autoConnect: false
    //   });
    //   this._socket.on('new_data', data => {
    //     this.setState({
    //       history: [data, ...this.state.history]
    //     });
    //   });

    //   this._socket.on('new_race_created', name => {
    //     this.setState({
    //       history: [],
    //       currentRaceName: name
    //     });
    //   });

    //   this._socket.on('current_race', name => {
    //     this.setState({
    //       currentRaceName: name
    //     });
    //   });
    //   this._socket.connect();
  }

  // componentWillUnmount(): void {
  //   this._socket?.disconnect();
  // }

  render() {
    return (
      <>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GaugeChart id="gauge-chart1" nrOfLevels={40} percent={ this.state.history[0].velocity / 50 } />
              <p> Wheel Speed </p>
            </Card>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GaugeChart id="gauge-chart1" nrOfLevels={40} percent={ this.state.history[0].engineTemp / 200 } />
              <p> Engine Temp </p>
            </Card>
          </Box>
        </Box>

        <h1>{this.state.currentRaceName}</h1>
        <p>{JSON.stringify(this.state.history, null, 4)}</p>
      </>
    );
  }
}

