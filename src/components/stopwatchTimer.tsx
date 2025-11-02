import { useEffect, useRef } from 'react';
import { useStopwatch } from 'react-timer-hook';

function formatNumber(num: number) {
  return (num < 10) ? `0${num}` : num;
}

export default function StopwatchTimer(props: {resetTime?: boolean, toggleRun?: boolean, withButtons?: boolean}) {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({ autoStart: false });

  // Use refs to track previous prop values, using resetTime and toggleRun as events
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
    <div style={{textAlign: 'center', padding: '4px', border: `8px solid ${isRunning ? 'var(--color-green-highlight)' : 'var(--color-alert)'}`}}>
      <div style={{fontSize: `${props.withButtons ? '30px' : '60px'}`}}>
        <span>{formatNumber(hours)}</span>:<span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
      </div>
      {props.withButtons ? 
        <>
          <button className='stopwatch-button' onClick={() => { !isRunning ? start() : pause(); }}>{isRunning ? 'Stop' : 'Start'}</button>
          <button className='stopwatch-button' onClick={() => { reset(undefined, false); }}>Reset</button>
        </>
        : null}
    </div>
  );
}

StopwatchTimer.defaultProps = {
  withButtons: true
};