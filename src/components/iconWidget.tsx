import React from 'react';

export default function IndicatorIcon(props: {
  on?: boolean;
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconWidth?: number;
}) {
  const { on, text, Icon, iconWidth } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        padding: '4px 6px',
        width: iconWidth, 
        backgroundColor: Icon ? 'transparent' : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)'),
      }}
    >
      <span
        style={{
          color: Icon ? (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)') : 'var(--color-icon-text)',
          whiteSpace: 'nowrap',
        }}
      >
        {text ? <strong>{text}</strong> : Icon ? (<Icon width={30} height={30} fill="currentColor" />) : null}
      </span>
    </div>
  );
}