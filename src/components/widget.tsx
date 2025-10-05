import { Card } from '@mui/material';
import { WidgetProps, validateWidgetSize, WIDGET_GRID } from '../types/widgetTypes';

export default function Widget(props: WidgetProps) {
  // Validate the size prop
  const validatedSize = validateWidgetSize(props.size);
  const [widthUnits, heightUnits] = validatedSize;
  
  // Calculate percentage based on grid system
  const widthPercent = (widthUnits / WIDGET_GRID.WIDTH_UNITS) * 100;
  const heightPercent = (heightUnits / WIDGET_GRID.HEIGHT_UNITS) * 100;
  
  return (
    <Card 
      className="widget" 
      style={{
        width: `${widthPercent}vw`,
        height: `${heightPercent}vh`,
      }}
    >
      <div className="widget-content">
        {props.children}
      </div>
    </Card>
  );
}