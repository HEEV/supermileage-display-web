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
  engineStatus: SegmentType;
};

import './styles/style.css';
import './styles/colors.css'; // unused import right now
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import { Component } from 'react';
import io from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowDownToLine, PanelTopBottomDashed, Settings } from 'lucide-react';
import Speedometer from './components/speedometer';
import BurnCoast, { SegmentType } from './components/burnCoast';
import TrackView from './components/trackView';
import IndicatorIcon from './components/iconWidget';
import WindSpeedometer from './components/windSpeedometer';

//const DATA_SOURCE = 'https://judas.arkinsolomon.net';
const DATA_SOURCE =
  window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'remote';

const menuActions = [
  { icon: <ArrowDownToLine />, name: 'Pull Settings' },
  { icon: <PanelTopBottomDashed />, name: 'Select Layout' },
];

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: ReturnType<typeof io>;
  private _animateInterval?: NodeJS.Timeout;

  constructor(props: Record<string, string>) {
    super(props);

    this.state = {
      history: [
        {
          velocity: 23,
          time: new Date(),
          distanceTraveled: 12100,
          batteryVoltage: 4,
          engineTemp: 0,
          radTemp: 0,
          timerResetButton: 0,
          toggleTimeButton: 0,
          wind: 4.1, //was just 4
          tilt: 3,
          latency: 0,
        },
      ],
      currentRaceName: '<no race>',
      engineStatus: SegmentType.COAST,
    };

    this.newRace = this.newRace.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.addDistance = this.addDistance.bind(this);
  }

  toggleStatus(): void {
    this.setState({
      engineStatus:
        this.state.engineStatus === SegmentType.BURN
          ? SegmentType.COAST
          : SegmentType.BURN,
    });
  }

  addDistance(): void {
    const updatedHistory = [...this.state.history];
    updatedHistory[0] = {
      ...updatedHistory[0],
      distanceTraveled: updatedHistory[0].distanceTraveled + 100,
    };
    this.setState({
      history: updatedHistory,
    });
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
    if (this._animateInterval) {
      clearInterval(this._animateInterval);
    }
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
          <div className="top-panel">
            <Box>
              <SpeedDial
                ariaLabel="Settings"
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 0,
                  '& .MuiFab-primary': {
                    backgroundColor: 'var(--color-tech)',
                    width: 45,
                    height: 45,
                    '&:hover': {
                      backgroundColor: 'var(--color-tech-secondary)',
                    },
                  },
                }}
                icon={<Settings />}
                direction="down"
              >
                {menuActions.map((action) => (
                  <SpeedDialAction
                    sx={{
                      '& .MuiFab-primary': {
                        backgroundColor: 'var(--color-tech)',
                      },
                    }}
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen={true}
                  />
                ))}
              </SpeedDial>
            </Box>
          </div>
          <div className="left-panel">
            <div className="panel-section">
              <TrackView
                trackName="ShellTrackFixed"
                distanceTraveled={this.state.history[0].distanceTraveled}
                scale={100}
              />
            </div>
          </div>
          <div className="center-panel">
            <Speedometer
              value={this.state.history[0].velocity}
              min={0}
              max={80}
              unit="MPH"
            />
          </div>
          <div className="right-panel">
            <div className="panel-section">
              <WindSpeedometer
                windSpeed={this.state.history[0].wind}
                relativeSpeed={
                  this.state.history[0].velocity - this.state.history[0].wind
                }
                speedType={'real'}
                noBackground
                windDir={180}
                displayUnits={true}
              />
            </div>
            <div className="panel-section">
              <div className="panel-label">Engine Status</div>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                flexWrap="nowrap"
              >
                <IndicatorIcon on={true} text={'Armed'} />
                <IndicatorIcon on={false} text={'Running'} />
              </Box>
            </div>
          </div>
          <div className="bottom-panel">
            <div style={{ display: 'flex', flexDirection: 'row'}}> {/* TODO: remove these buttons when burn-coast widget is finished */}
              <button onClick={this.toggleStatus}>Toggle Status (Test)</button>
              <button onClick={this.addDistance}>Add 100ft (Test)</button>
            </div>
            
            <BurnCoast
              currentDistance={this.state.history[0].distanceTraveled}
              currentStatus={this.state.engineStatus}
            />
          </div>
        </Box>
      </>
    );
  }
}
