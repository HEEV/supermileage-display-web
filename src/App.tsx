export type DataEntry = {
  time: Date;
  velocity: number;
  distanceTraveled: number;
  batteryVoltage: number;
  engineTemp: number;
  radTemp: number;
  timerResetButton: number;
  toggleTimeButton: number;
  wind: number;
  tilt: number;
};

// latency is in ms
export type HistoryData = DataEntry & { latency: number };

export type AppState = {
  history: HistoryData[];
  currentRaceName: string;
};

import './style.css';
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import { Component } from 'react';
import io from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import BasicGauge from './components/basicGauge';
import Widget from './components/widget';
import { ArrowDownToLine, PanelTopBottomDashed, Settings } from 'lucide-react';

//const DATA_SOURCE = 'https://judas.arkinsolomon.net';
const DATA_SOURCE =
  window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'remote';

const menuActions = [
  { icon: <ArrowDownToLine />, name: 'Pull Settings' },
  { icon: <PanelTopBottomDashed />, name: 'Select Layout' },
];

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: ReturnType<typeof io>;

  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [
        {
          velocity: 23,
          time: new Date(),
          distanceTraveled: 15500,
          batteryVoltage: 4,
          engineTemp: 0,
          radTemp: 0,
          timerResetButton: 0,
          toggleTimeButton: 0,
          wind: 4,
          tilt: 3,
          latency: 0,
        },
      ],
      currentRaceName: '<no race>',
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
        autoConnect: false,
      });

      // data receipt event handler
      this._socket.on(
        'new_data',
        (data: (DataEntry | { time: string }) | HistoryData) => {
          data.time = new Date(data.time);
          (data as HistoryData & { latency?: number }).latency =
            Date.now() - data.time.valueOf();
          this.setState({
            history: [data as HistoryData, ...this.state.history],
          });
        }
      );

      // race creation event handler, may not be needed
      this._socket.on('new_race_created', (name: string) => {
        this.setState({
          history: [],
          currentRaceName: name,
        });
      });

      // current race event handler, not sure what this does
      this._socket.on('current_race', (name: string) => {
        this.setState({
          currentRaceName: name,
        });
      });
      this._socket.connect();
    } else {
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
        <Box className="wait-screen">
          <h1>Waiting for data...</h1>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        <Box id="main-box">
          <Widget size={[15, 8]}>
            <BasicGauge
              title="Speed"
              value={this.state.history[0].velocity}
              min={0}
              max={80}
              unit="MPH"
            />
          </Widget>
          <Widget size={[15, 8]}>
            <BasicGauge
              title="Wind"
              value={this.state.history[0].wind}
              min={0}
              max={40}
              unit="MPH"
            />
          </Widget>
          <Widget size={[10, 5]}>This is a mostly empty widget wrapper</Widget>
        </Box>
        <Box>
          <SpeedDial
            ariaLabel='Settings'
            sx={{ position: 'absolute', top: 8, right: 8}}
            icon={<Settings />}
            direction='down'
          >
            {menuActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen={true}
              />
            ))}
          </SpeedDial>
        </Box>
      </>
    );
  }
}
