import { ArrowUp, Minus} from 'lucide-react';

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
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {realWindSpeed ? <div className="panel-label">Headwind Speed</div> : null}
      {relativeWindSpeed ? <div className="panel-label">Relative Speed</div> : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {realWindSpeed ? <div className={windClass}>{windSpeed}</div> : null}
        {relativeWindSpeed ? <div className={windClass}>{relativeSpeed}</div> : null}
        {windDir != null ? 
          windSpeed != 0.0 ? 
            <ArrowUp
              width={32}
              height={36}
              strokeWidth={3.25}
              color={'var(--color-text)'}
              style={{ transform: `rotate(${arrowDeg}deg)` }}
            />
            : 
            <Minus 
              color={'var(--color-text)'}
              strokeWidth={3.25}
            />
          : null}
      </div>
      {displayUnits ? <span className={'wind-mph'}>MPH</span> : null}
    </div>
  );
}