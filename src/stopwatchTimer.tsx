import { useEffect, useRef } from 'react';
import { useStopwatch } from 'react-timer-hook';

function formatNumber(num: number) {
  if (num < 10) {
    return `0${num}`;
  }
  else {
    return num;
  }
}

export default function StopwatchTimer(props: {resetTime?: boolean, toggleRun?: boolean}) {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({ autoStart: false });

  // Use refs to track previous prop values
  const prevResetTimeRef = useRef(props.resetTime);
  const prevToggleRunRef = useRef(props.toggleRun);
 
  // Handle reset
  useEffect(() => {
    // Only reset when resetTime changes from false to true
    if (props.resetTime && !prevResetTimeRef.current) {
      reset();
      pause();
      console.log('reset');
    }
    // Update the ref
    prevResetTimeRef.current = props.resetTime;
  }, [props.resetTime, reset, isRunning]);
 
  // Handle toggle run
  useEffect(() => {
    console.log('Toggle effect running', { toggleRun: props.toggleRun, prev: prevToggleRunRef.current });
    // Only toggle when toggleRun changes from false to true
    if (props.toggleRun && !prevToggleRunRef.current) {
      if (!isRunning) {
        start();
      } else {
        pause();
      }
      console.log('toggled', !isRunning ? 'start' : 'pause');
    }
    // Update the ref
    prevToggleRunRef.current = props.toggleRun;
  }, [props.toggleRun, start, pause, isRunning]);

  return (
    <div style={{textAlign: 'center', border: `8px solid ${isRunning ? 'green' : 'red'}`}}>
      <div style={{fontSize: '30px'}}>
        <span>{formatNumber(hours)}</span>:<span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
      </div>
      <button style={{width: '150px', height: '35px', margin: '1px'}} onClick={() => { !isRunning ? start() : pause(); }}>{isRunning ? 'Stop' : 'Start'}</button>
      <button style={{width: '150px', height: '35px', margin: '1px'}} onClick={() => { reset(undefined, false); }}>Reset</button>
    </div>
  );
}