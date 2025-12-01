import { JSX } from 'react';

export default function Speedometer(props: {
  value: number;
  min: number;
  max: number;
  unit: string;
//no burn value means no burn or coast indicator
//burn true means burn indicator; burn false means coast indicator
  burn?: boolean; 
}): JSX.Element {
  return (
    <div className="wrap">
      <div className={props.burn === undefined ? 'ring' : props.burn ? 'burn-ring' : 'coast-ring'}></div>
      <div className="speed-center">
        <div 
          className="speed-value" 
          style={{ opacity: props.burn !== undefined ? 0.3 : 1 }}
        >
          {Math.round(props.value)}
        </div>
        <div 
          className="gauge-unit" 
          style={{ opacity: props.burn !== undefined ? 0.3 : 1 }}
        >
          {props.unit}
        </div>
        {
          props.burn !== undefined && 
            <div className={props.burn ? 'engine-on': 'engine-off'}>
              {props.burn ? 'ENGINE ON' : 'ENGINE OFF'}
            </div>
        }
      </div>
    </div>
  );
}
