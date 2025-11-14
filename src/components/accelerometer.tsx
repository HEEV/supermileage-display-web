import React from 'react';
import { ReactComponent as CarIcon } from '../styles/icons/car-solid-full.svg';

function renderCarIcon(angle = 45, size = 30) {
  return <CarIcon width={size} height={size} fill="currentColor" style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }} />;
}

export default function Accelerometer(props: {
  state: 'good' | 'bad' | 'warn';
  display?: 'icon' | 'bar';
}) {
  const { state, display = 'icon' } = props;
  const bgColor = state === 'good' ? 'var(--color-accel-good)' : 
    (state === 'bad' ? 'var(--color-accel-bad)' : 'var(--color-accel-caut)');
  
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
          {renderCarIcon()}!
        </span>
      </div>
    ) : (
      <div
        className={'accelerometer-bar'}
      >
        {renderCarIcon(0)}
      </div>
    )
  );
}