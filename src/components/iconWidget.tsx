import React, { useEffect, useRef } from 'react';
import { ReactComponent as CarIcon } from '../styles/car-solid-full.svg';

export default function IndicatorIcon(props: {
  on?: boolean;
  text?: string;
  img?: boolean;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) {
  const { on, text, img, Icon } = props;
  const prevOnRef = useRef(props.on);

  useEffect(() => {
    if (props.on && !prevOnRef.current) {
      // armed changed to true
    }
    prevOnRef.current = props.on;
  }, [props.on]);

  const IconComp = Icon ?? CarIcon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 6px',
        backgroundColor: img ? 'transparent' : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)'),
      }}
    >
      <span
        style={{
          color: img ? (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)') : (on ? 'var(--color-icon-on-text)' : 'var(--color-icon-off-text)'),
        }}
      >
        {text ? <strong>{text}</strong> : <IconComp width={30} height={30} fill="currentColor" />}
      </span>
    </div>
  );
}