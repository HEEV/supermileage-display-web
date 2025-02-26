export type DataEntry = {
  time: Date;
  velocity: number;
  distanceTraveled: number;
  batteryVoltage: number;
  engineTemp: number;
  wind: number;
  tilt: number;
}

// latency is in ms
export type HistoryData = DataEntry & { latency: number; };

export type AppState = {
  history: HistoryData[];
  currentRaceName: string;
}

import './style.css';
import { Box, Card} from '@mui/material';
import { Component } from 'react';
import { Socket, io } from 'socket.io-client';
import ReactSpeedometer from 'react-d3-speedometer';
import CircularProgress from '@mui/material/CircularProgress';
import StopwatchTimer from './stopwatchTimer';
import TrackView from './trackView';
import LinearGauge from './linearGauge';
import BasicGauge from './basicGauge';

//const DATA_SOURCE = 'https://judas.arkinsolomon.net';
const DATA_SOURCE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'remote';

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: Socket;

  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [
        //{velocity:23, time: new Date(), distanceTraveled: 15500, batteryVoltage: 4, engineTemp: 0, wind: 4, tilt: 3, latency: 0}
      ],
      currentRaceName: '<no race>'
    };

    this.newRace = this.newRace.bind(this);
  }

  // request a new race on the db, may not be needed anymore
  newRace(): void {
    this._socket?.emit('request_new_race');
  }

  // handle connection to local data server, when components initially mount to DOM
  componentDidMount(): void {
    // If we are running on the car, we don't need remote data server connection
    if (DATA_SOURCE === 'http://localhost:8080') {
      this._socket = io(DATA_SOURCE, {
        autoConnect: false
      });
      
      // data receipt event handler
      this._socket.on('new_data', (data: (DataEntry | { time: string }) | HistoryData) => {
        data.time = new Date(data.time);
        (data as HistoryData & { latency?: number }).latency = Date.now() - data.time.valueOf();
        this.setState({
          history: [data as HistoryData, ...this.state.history]
        });
      });

      // race creation event handler, may not be needed
      this._socket.on('new_race_created', name => {
        this.setState({
          history: [],
          currentRaceName: name
        });
      });

      // current race event handler, not sure what this does
      this._socket.on('current_race', name => {
        this.setState({
          currentRaceName: name
        });
      });
      this._socket.connect();
    }
    else {
      // fetch data from postgres db
      // TODO: implement fetch from remote data server, requires separate api backend
      console.log('setting up setInterval for data fetch.');
    }
  }

  // handle disconnection from local data server, when components are removed from DOM
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

    return (
      <>
        <Box id='stopwatch'>
          <Box id='race-info'>
            <h2>Race: {this.state.currentRaceName}</h2>
            {window.location.hostname === 'localhost' ? <button style={{width: '150px', height: '35px', margin: '1px'}} onClick={this.newRace}>Start New Race</button> : null}
          </Box>
          {window.location.hostname === 'localhost' ? <StopwatchTimer /> : null}
        </Box>
        <Box id='main-box'>
          <Box id='primary-gauges'>
            <Card className='gauge-box'>
              <BasicGauge title='Velocity' value={this.state.history[0].velocity} min={0} max={80} unit='MPH' />
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
              <BasicGauge title='Wind Speed' value={this.state.history[0].wind} min={0} max={40} unit='MPH' />
            </Card>
          </Box>
          <Box id='track-box' sx={{height: '30vh'}}>
            <Card id='battery-card'>
              <LinearGauge length={150} value={this.state.history[0].engineTemp} max={200} units={'F'} precision={0} />
            </Card>
            <Card sx={{minHeight: '225px', height: '20vh', display: 'flex', alignItems: 'center'}}>
              <TrackView trackName={'ShellTrackFixed'} distanceTraveled={this.state.history[0].distanceTraveled} scale={80} />
            </Card>
            <Card id='battery-card'>
              <LinearGauge length={150} value={this.state.history[0].batteryVoltage} max={12} units={'V'} barColor={'navy'} />
            </Card>
          </Box>
        </Box>
        <Card id='latency'>
          <p>Latency (ms): {this.state.history[0].latency}</p>
        </Card>
      </>
    );
  }
}

