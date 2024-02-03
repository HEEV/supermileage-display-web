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
  } = useStopwatch({ autoStart: true });

  return (
    <div style={{textAlign: 'center', border: `8px solid ${isRunning ? 'green' : 'red'}`}}>
      <div style={{fontSize: '100px'}}>
        <span>{formatNumber(hours)}</span>:<span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
      </div>
      <button style={{width: '200px', height: '40px', margin: '1px'}} onClick={start}>Start</button>
      <button style={{width: '200px', height: '40px', margin: '1px'}} onClick={() => {
        reset(undefined, false);
      }}>Reset</button>
    </div>
  );
}