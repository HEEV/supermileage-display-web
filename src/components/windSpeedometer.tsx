import { ArrowUp} from 'lucide-react';

export default function WindSpeedometer(props: { 
  windSpeed: number, 
  relativeSpeed: number, 
  speedType?: 'real' | 'relative' | 'both',
  displayUnits?: boolean, 
  windDir?: number,
  noBackground?: boolean 
}) {
  const { windSpeed, relativeSpeed, speedType='both', displayUnits, windDir, noBackground } = props;
  const windClass = noBackground ? 'wind-speed transparent' : 'wind-speed';
  const arrowDeg = ((windDir ?? 0) + 180) % 360;
  const realWindSpeed = speedType == 'real' || speedType == 'both';
  const relativeWindSpeed = speedType == 'relative' || speedType == 'both';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className={'wind-speedometer-container'}>
        {realWindSpeed ? <div className={windClass}><span>Wind Speed</span>{windSpeed}</div> : null}
        {relativeWindSpeed ? <div className={windClass}><span>Relative Speed</span>{relativeSpeed}</div> : null}
      </div>
      {windDir != null ? <ArrowUp
        width={32}
        height={36}
        strokeWidth={3.25}
        style={{ transform: `rotate(${arrowDeg}deg)` }}
      /> : null}
      {displayUnits ? <span className={'wind-mph'}>MPH</span> : null}
    </div>
  );
}