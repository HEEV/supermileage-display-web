import { ArrowUp} from 'lucide-react';

export default function WindSpeedometer(props: { windSpeed: number, relativeSpeed: number, mph?: boolean, windDir?: number }) {
  const { windSpeed, relativeSpeed, mph, windDir } = props;
  const arrowDeg = ((windDir ?? 0) + 180) % 360;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className={'wind-speedometer-container'}>
        <div className={'wind-speed'}><span style={{ marginLeft: 8 }}>Wind Speed</span>{windSpeed}</div>
        <div className={'wind-speed'}><span style={{ marginLeft: 8 }}>Relative Speed</span>{relativeSpeed}</div>
      </div>
      {windDir != null ? <ArrowUp
        width={32}
        height={36}
        style={{ transform: `rotate(${arrowDeg}deg)` }}
      /> : null}
      {mph ? <span className={'wind-mph'}>MPH</span> : null}
    </div>
  );
}