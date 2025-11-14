import React from 'react';
import { ReactComponent as CarIcon } from './styles/icons/car-solid-full.svg';

export default function Accelerometer(props: {
  on?: boolean;
  text?: string;
}) {
  const { on, text } = props;
  const bgColor = on ? 'transparent' : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)');
  const spanContent = text || (on && <CarIcon width={30} height={30} fill="currentColor" />);
  
  return (
    <div
      className={'accelerometer'}
      style={{
        backgroundColor: bgColor,
        borderColor: bgColor
      }}
    >
      <span
        style={{
          color: bgColor,
        }}
      >
        {spanContent}
      </span>
    </div>
  );
}