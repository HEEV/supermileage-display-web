import './styles/style.css';
import './styles/colors.css'; // unused import right now
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import { Component } from 'react';
import io from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowDownToLine, PanelTopBottomDashed, Settings } from 'lucide-react';
import Speedometer from './components/speedometer';
import BurnCoast from './components/burnCoast';
import { SegmentType } from './types/simulationTypes';
import { SAMPLE_SIMULATION } from './constants';
import TrackView from './components/trackView';
import IndicatorIcon from './components/iconWidget';
import WindSpeedometer from './components/windSpeedometer';
import {
  buildHistoryPacket,
  getNumberValue,
  initializePacketFields,
  isTruthyStatus,
  type HistoryPacket,
  type IncomingPacket,
} from './services/dynamicTelemetry';
import BasicGauge from './components/basicGauge';

export type AppState = {
  history: HistoryPacket[];
  currentRaceName: string;
  startNewRace: boolean;
};

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
      history: [],
      currentRaceName: '<no race>',
      startNewRace: false,
    };
  }

  // handle connection to local data server, when components initially mount to DOM
  componentDidMount(): void {
    // Load config first, then connect socket
    initializePacketFields().then(() => {
      if (DATA_SOURCE === 'http://localhost:8080') {
        this._socket = io(DATA_SOURCE, {
          autoConnect: false,
        });

        // data receipt event handler
        this._socket.on(
          'new_data',
          (data: IncomingPacket) => {
            const packet = buildHistoryPacket(data);
            this.setState((prevState) => ({
              history: [packet, ...prevState.history],
            }));
            console.log(data);
          }
        );
        this._socket.connect();
      }
    });
  }

  // handle disconnection from local data server, when components are removed from DOM
  componentWillUnmount(): void {
    this._socket?.disconnect();
    if (this._animateInterval) {
      clearInterval(this._animateInterval);
    }
  }

  render() {
    const latest = this.state.history[0];

    if (!latest) {
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
                trackName='ShellTrackFixed'
                distanceTraveled={getNumberValue(latest.distance_traveled)}
                scale={100}
                resetTriggered={this.state.startNewRace}
              />
            </div>
            <div className="panel-section">
              <BasicGauge title="voltage" value={getNumberValue(latest.voltage)} min={0} max={36} unit="V" />
            </div>
          </div>
          <div className="center-panel">
            <Speedometer 
              value={getNumberValue(latest.speed)}
              min={0}
              max={80}
              unit="MPH"
              burnCountdownTime={10000}
              coastCountdownTime={5000}
              animate={true}
            />
          </div>
          <div className="right-panel">
            <div className="panel-section">
              <WindSpeedometer
                windSpeed={Math.trunc(getNumberValue(latest.airspeed) * 10) / 10}
                relativeSpeed={Math.trunc((getNumberValue(latest.speed) - getNumberValue(latest.airspeed)) * 10) / 10}
                speedType={'real'}
                noBackground
                windDir={180}
                displayUnits={true}
              />
            </div>
            <div className="panel-section">
              <div className="panel-label">Engine Status</div>
              <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexWrap="nowrap">
                <IndicatorIcon on={isTruthyStatus(latest.engine_armed)} text={'Armed'} />
                <IndicatorIcon on={isTruthyStatus(latest.engine_on)} text={'Running'} />
              </Box>
            </div>
          </div>
          <div className="bottom-panel">
            <BurnCoast
              currentDistance={getNumberValue(latest.distance_traveled)}
              currentStatus={isTruthyStatus(latest.engine_on) ? SegmentType.BURN : SegmentType.COAST}
              simulationOutput={SAMPLE_SIMULATION}
              resetTriggered={isTruthyStatus(latest.timer_reset_button)}
            />
          </div>
        </Box>
      </>
    );
  }
}
