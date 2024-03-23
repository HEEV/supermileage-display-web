import { Box } from '@mui/material';
import { Rect, Layer, Stage } from 'react-konva';


linearGauge.defaultProps = {
  backgroundColor: 'lightgray',
  barColor: 'Gold',
  units: '',
  precision: 2,
};

export default function linearGauge(props: {length: number, value: number, max: number, 
                                    backgroundColor: string, barColor: string, units: string, precision: number}) {

  const {length, value, max, backgroundColor, barColor, units, precision} = props;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Stage width={length * 0.3} height={length}>
        <Layer>
          <Rect 
            x={0}
            y={0}
            width={length * 0.3}
            height={length}
            fill={backgroundColor}
          />
        </Layer>
        <Layer>
          <Rect 
            x={length * 0.3 - (length * 0.07)}
            y={length * 0.25}
            width={length * 0.07}
            height={2}
            fill="black"
          />
          <Rect 
            x={length * 0.3 - (length * 0.1)}
            y={length * 0.5}
            width={length * 0.1}
            height={2}
            fill="black"
          />
          <Rect 
            x={length * 0.3 - (length * 0.07)}
            y={length * 0.75}
            width={length * 0.07}
            height={2}
            fill="black"
          />
        </Layer>
        <Layer>
          <Rect
            x={(length * 0.3) * (1/3)}
            y={0}
            width={length * 0.1}
            height={length}
            strokeWidth={length * 0.005}
            stroke="gray"
          />
        </Layer>
        <Layer>
          <Rect 
            x={(length * 0.3) * (1/3)}
            y={length * (1 - value / max)}
            width={length * 0.1}
            height={length * value / max}
            fill={barColor}
          />
        </Layer>
      </Stage>
      
      <Box sx={{textAlign: 'center', fontWeight: 'bold'}}>{value.toFixed(Math.abs(precision))} {units}</Box>
    </Box>
  );
}