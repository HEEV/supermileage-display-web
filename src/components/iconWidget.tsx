import React, { useEffect, useRef } from 'react';

export default function IndicatorIcon(props: {
  on?: boolean;
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) {
  const { on, text, Icon } = props;
  const prevOnRef = useRef(props.on);

  useEffect(() => {
    if (props.on && !prevOnRef.current) {
      // armed changed to true
    }
    prevOnRef.current = props.on;
  }, [props.on]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        padding: '4px 6px',
        backgroundColor: Icon ? 'transparent' : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)'),
      }}
    >
      <span
        style={{
          color: Icon ? (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)') : (on ? 'var(--color-icon-on-text)' : 'var(--color-icon-off-text)'),
        }}
      >
        {text ? <strong>{text}</strong> : Icon ? (<Icon width={30} height={30} fill="currentColor" />) : null}
      </span>
    </div>
  );
}