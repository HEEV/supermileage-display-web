/* eslint-disable linebreak-style */
import { Typography } from '@mui/material';
import { JSX } from 'react';

export default function BasicGauge(props: {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}): JSX.Element {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}} className="basic-gauge">
      <Typography variant="h6" sx={{ margin: 0, padding: 0, fontSize: '1.5em', lineHeight: '0.95' }}>
        {props.title}
      </Typography>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography sx={{ 
          fontSize: '12em', 
          lineHeight: 0.9, 
          margin: 0, 
          padding: 0,
          display: 'block'
        }}>
          {Math.round(props.value)}
        </Typography>
        <Typography sx={{ margin: 0, marginTop: '-0.5em', fontSize: '2em' }}>
          {props.unit}
        </Typography>
      </div>
    </div>
  );
}
