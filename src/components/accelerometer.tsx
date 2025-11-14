import React from 'react';
import { ReactComponent as CarIcon } from '../styles/icons/car-solid-full.svg';

export default function Accelerometer(props: {
  state: 'good' | 'bad' | 'warn';
  display?: 'icon' | 'bar';
}) {
  const { state, display = 'icon' } = props;
  const bgColor = state === 'good' ? 'var(--color-accel-good)' : (state === 'bad' ? 'var(--color-accel-bad)' : 'var(--color-accel-caut)');
  const carIcon = (<CarIcon width={30} height={30} fill="currentColor" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />);
  
  return (
    display === 'icon' ? (
      <div
        className={'accelerometer'}
        style={{
          borderColor: bgColor
        }}
      >
        <span
          style={{
            color: bgColor,
          }}
        >
          {carIcon}!
        </span>
      </div>
    ) : (
      <div
        className={'accelerometer-bar'}
      >
        <CarIcon width={30} height={30} fill='black' style={{ transform: 'rotate(0deg)', transformOrigin: 'center' }} />
      </div>
    )
  );
}