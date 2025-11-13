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
  burnState: boolean | undefined;
};

import './styles/style.css';
import './styles/colors.css'; // unused import right now
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import { Component } from 'react';
import io from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import BasicGauge from './components/basicGauge';
import Widget from './components/widget';
import { ArrowDownToLine, PanelTopBottomDashed, Settings } from 'lucide-react';
import Speedometer from './components/speedometer';
import LinearGauge from './components/linearGauge';
import TrackView from './components/trackView';
import StopwatchTimer from './components/stopwatchTimer';
import IndicatorIcon from './components/iconWidget';
// downloaded from https://fontawesome.com/icons
import { ReactComponent as CarIcon } from './styles/icons/car-solid-full.svg';
import { ReactComponent as FlagIcon } from './styles/icons/flag-solid-full.svg';


//const DATA_SOURCE = 'https://judas.arkinsolomon.net';
const DATA_SOURCE =
  window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'remote';

const menuActions = [
  { icon: <ArrowDownToLine />, name: 'Pull Settings' },
  { icon: <PanelTopBottomDashed />, name: 'Select Layout' },
];

export default class App extends Component<Record<string, string>, AppState> {
  private _socket?: ReturnType<typeof io>;
  private _burnInterval?: NodeJS.Timeout;

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
      burnState: undefined,
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

    // simulate burn state changes
    const burnStates: (boolean | undefined)[] = [true, false, undefined];
    let currentIndex = 0;
    
    this._burnInterval = setInterval(() => {
      this.setState({ burnState: burnStates[currentIndex] });
      currentIndex = (currentIndex + 1) % burnStates.length;
    }, 5000);
  }

  // handle disconnection from local data server, when components are removed from DOM
  componentWillUnmount(): void {
    this._socket?.disconnect();
    if (this._burnInterval) {
      clearInterval(this._burnInterval);
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
            <Widget size={[6, 2]}>
              <StopwatchTimer withButtons />
            </Widget>
            <Box>
              <SpeedDial
                ariaLabel='Settings'
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  '& .MuiFab-primary': {
                    backgroundColor: 'var(--color-tech)',
                    '&:hover': {
                      backgroundColor: 'var(--color-tech-secondary)',
                    }
                  }
                }}
                icon={<Settings />}
                direction='down'
              >
                {menuActions.map((action) => (
                  <SpeedDialAction
                    sx={{
                      '& .MuiFab-primary': {
                        backgroundColor: 'var(--color-tech)',
                      }
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
              {/* <Widget size={[6, 6]}> */}
              <TrackView
                trackName='ShellTrackFixed'
                distanceTraveled={this.state.history[0].distanceTraveled}
                scale={100}
              />
              {/* </Widget> */}
            </div>
          </div>
          <div className="center-panel">
            <Widget size={[16,9]}>
              <Speedometer 
                value={this.state.history[0].velocity}
                min={0}
                max={80}
                unit="MPH"
                burn={this.state.burnState}
              />
            </Widget>
          </div>
          <div className="right-panel">
            <div className="panel-section">
              {/* <Widget size={[7, 5]}> */}
              <BasicGauge
                title="Wind"
                value={this.state.history[0].wind}
                min={0}
                max={40}
                unit="MPH"
              />
              {/* </Widget> */}
            </div>
            <div className="panel-section">
              <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexWrap="nowrap">
                {/* <Widget size={[1, 0.5]}>
                  <IndicatorIcon on={true} text={''} Icon={CarIcon}/>
                </Widget> */}
                {/* <Widget size={[2, 1]}> */}
                <IndicatorIcon on={true} text={'Armed'} />
                {/* </Widget> */}
                {/* <Widget size={[2,1]}> */}
                <IndicatorIcon on={false} text={'Engine On'} />
                {/* </Widget> */}
                {/* <Widget size={[2, 0.5]}>
                  <IndicatorIcon on={false} text={'Kill Switch'} iconWidth={100}/>
                </Widget> */}
                {/* <Widget size={[1, 0.5]}>
                  <IndicatorIcon on={false} text={''} Icon={FlagIcon}/>
                </Widget> */}
              </Box>
            </div>
          </div>
          {/* <Box display='flex' flexDirection={'row'}>
            <Widget size={[5, 5]}>
              <LinearGauge
                length={200}
                value={this.state.history[0].batteryVoltage}
                max={10}
                backgroundColor='var(--color-bg)'
                barColor='var(--color-green-dull)'
                units="V"
                precision={2}
                warnValue={6}
              />
            </Widget>
            <Widget size={[7, 5]}>
              <TrackView
                trackName='ShellTrackFixed'
                distanceTraveled={this.state.history[0].distanceTraveled}
                scale={100}
              />
            </Widget>
          </Box> */}
        </Box>
      </>
    );
  }
}
