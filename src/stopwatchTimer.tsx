import { useStopwatch } from 'react-timer-hook';

function formatNumber(num: number) {
  if (num < 10) {
    return `0${num}`;
  }
  else {
    return num;
  }
}

export default function StopwatchTimer() {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    reset
  } = useStopwatch({ autoStart: false });

  return (
    <div style={{textAlign: 'center', border: `8px solid ${isRunning ? 'green' : 'red'}`}}>
      <div style={{fontSize: '30px'}}>
        <span>{formatNumber(hours)}</span>:<span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
      </div>
      <button style={{width: '150px', height: '35px', margin: '1px'}} onClick={() => { !isRunning ? start() : null; }}>Start</button>
      <button style={{width: '150px', height: '35px', margin: '1px'}} onClick={() => { reset(undefined, false); }}>Reset</button>
    </div>
  );
}