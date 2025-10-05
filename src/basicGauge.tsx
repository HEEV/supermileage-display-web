/* eslint-disable linebreak-style */
import { Typography } from '@mui/material';
import { JSX } from 'react';
import Widget from './components/widget';

export default function BasicGauge(props: {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}): JSX.Element {
  return (
    <Widget size={[15, 8]}>
      <div className="basic-gauge">
        <Typography variant="h6" className="gauge-title">
          {props.title}
        </Typography>
        <div>
          <Typography 
            className="gauge-value"
          >
            {Math.round(props.value)}
          </Typography>
          <Typography className="gauge-unit">
            {props.unit}
          </Typography>
        </div>
      </div>
    </Widget>
  );
}
