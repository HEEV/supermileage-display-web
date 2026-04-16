
import { JSX } from 'react';

export default function BasicGauge(props: {
  title: string;
  value?: number;
  min: number;
  max: number;
  unit: string;
}): JSX.Element {
  const displayValue = props.value === undefined ? '--' : Math.round(props.value);

  return (
    <div className="basic-gauge">
      <div className="panel-label">
        {props.title}
      </div>
      <div>
        <div
          className="gauge-value"
        >
          {displayValue}
        </div>
        <div className="gauge-unit">
          {props.unit}
        </div>
      </div>
    </div>
  );
}
