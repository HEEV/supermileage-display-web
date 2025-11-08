import { useEffect, useRef } from 'react';
import { useStopwatch } from 'react-timer-hook';

function formatNumber(num: number) {
  return (num < 10) ? `0${num}` : num;
}

export default function WindSpeedometer(props: { windSpeed: number, relativeSpeed: number, mph?: boolean}) {
  const { windSpeed, relativeSpeed, mph } = props;


  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className={'wind-speedometer-container'}>
        <div className={'wind-speed'}><span style={{ marginLeft: 8 }}>Wind Speed</span>{windSpeed}</div>
        <div className={'wind-speed'}><span style={{ marginLeft: 8 }}>Relative Speed</span>{relativeSpeed}</div>
      </div>
      {mph ? <span className={'wind-mph'}>MPH</span> : null}
    </div>
  );
}

//style={{['--scale' as any]: 3.2}
//style={{['--scale' as any]: 3.2}