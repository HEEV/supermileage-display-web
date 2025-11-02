import { Box, Typography } from '@mui/material';
import { Rect, Layer, Stage } from 'react-konva';

function getCSSVariable(color: string): string {
  if (color.startsWith('var(')) {
    const varName = color.match(/var\((--[^)]+)\)/)?.[1];
    if (varName) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    }
  }
  return color;
}

linearGauge.defaultProps = {
  backgroundColor: 'lightgray',
  barColor: 'Gold',
  units: '',
  precision: 2,
};

export default function linearGauge(props: {
  length: number;
  value: number;
  max: number;
  backgroundColor: string;
  barColor: string;
  units: string;
  precision: number;
  label?: string;
  warnValue?: number;
}) {
  const {
    length,
    value,
    max,
    backgroundColor,
    barColor,
    units,
    precision,
    label,
    warnValue,
  } = props;

  const warnValueValid = warnValue && warnValue <= max;
  if (!warnValueValid) {
    console.warn('warnValue must be less than max');
  }

  return (
    <Box className="basic-gauge">
      {label ? <Typography variant="h6">{label}</Typography> : null}
      <Stage width={length * 0.3} height={length}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={length * 0.3}
            height={length}
            fill={getCSSVariable(backgroundColor)}
          />
        </Layer>
        <Layer>
          <Rect
            x={length * 0.3 - length * 0.07}
            y={length * 0.25}
            width={length * 0.07}
            height={2}
            fill={getCSSVariable('var(--color-faded-text)')}
          />
          <Rect
            x={length * 0.3 - length * 0.1}
            y={length * 0.5}
            width={length * 0.1}
            height={2}
            fill={getCSSVariable('var(--color-faded-text)')}
          />
          <Rect
            x={length * 0.3 - length * 0.07}
            y={length * 0.75}
            width={length * 0.07}
            height={2}
            fill={getCSSVariable('var(--color-faded-text)')}
          />
          {warnValueValid ? (
            <Rect
              x={length * 0.3 - length * 0.25}
              y={length * (1 - warnValue / max)}
              width={length * 0.2}
              height={4}
              fill={getCSSVariable('var(--color-alert)')}
            />
          ) : null}
        </Layer>
        <Layer>
          <Rect
            x={length * 0.3 * (1 / 3)}
            y={0}
            width={length * 0.1}
            height={length}
            strokeWidth={length * 0.005}
            stroke={getCSSVariable('var(--color-text)')}
          />
        </Layer>
        <Layer>
          <Rect
            x={length * 0.3 * (1 / 3)}
            y={length * (1 - value / max)}
            width={length * 0.1}
            height={(length * value) / max}
            fill={getCSSVariable(barColor)}
          />
        </Layer>
      </Stage>

      <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {value.toFixed(Math.abs(precision))} {units}
      </Box>
    </Box>
  );
}
