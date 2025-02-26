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
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}} className="basic-gauge">
      <Typography style={{textAlign: 'center'}} variant="h6">{props.title}</Typography>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', border: '8px solid darkgray', margin: '20px', width: '90%'}}>
        <Typography style={{textAlign: 'center', width: 'min', marginRight: '10px'}} variant="h1">{Math.round(props.value)}</Typography>
        <Typography style={{textAlign: 'center', alignContent: 'bottom'}} variant="h6">{props.unit}</Typography>
      </div>
    </div>
  );
}
