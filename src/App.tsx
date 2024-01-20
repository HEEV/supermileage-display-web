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

import { Component } from 'react';
import { Socket, io } from 'socket.io-client';

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
    this._socket = io('http://localhost:38392', {
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
        <h1>{this.state.currentRaceName}</h1>
        <p>{JSON.stringify(this.state.history, null, 4)}</p>
      </>
    );
  }
}