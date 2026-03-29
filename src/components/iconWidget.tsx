import React from 'react';

export default function IndicatorIcon(props: {
  on?: boolean;
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconWidth?: number;
}) {
  const { on, text, Icon, iconWidth } = props;
  const isDisabled = on === undefined;
  const bgColor = Icon
    ? 'transparent'
    : isDisabled
      ? 'var(--color-icon-disabled)'
      : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)');
  const imgColor = Icon
    ? isDisabled
      ? 'var(--color-icon-disabled)'
      : (on ? 'var(--color-icon-on)' : 'var(--color-icon-off)')
    : 'var(--color-icon-text)';
  const spanContent = text || (Icon && <Icon width={30} height={30} fill="currentColor" />);
  
  return (
    <div
      className={'indicator-icon'}
      style={{
        width: iconWidth, 
        backgroundColor: bgColor,
      }}
    >
      <span
        style={{
          color: imgColor,
        }}
      >
        {spanContent}
      </span>
    </div>
  );
}