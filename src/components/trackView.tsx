import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TRACKS } from '../constants';

export default function TrackView(props: {
  trackName: string;
  distanceTraveled: number;
  scale: number;
  resetTriggered?: boolean;
}) {
  const [distOffset, setDistOffset] = useState(0);

  // If reset button is active, zero out the distance traveled.

  useEffect(() => {
    if (props.resetTriggered) {
      setDistOffset(props.distanceTraveled);
    }
  }, [props.resetTriggered, props.distanceTraveled]);

  const trackTransition = { duration: 0.5, yoyo: Infinity };
  const pathRef = useRef<SVGPathElement>(null);
  const trackLength = TRACKS[props.trackName as keyof typeof TRACKS].length;
  const progress =
    (Math.max(0, props.distanceTraveled - distOffset) % trackLength) /
    trackLength;

  // Calculate the position of the arrow based on progress
  const [arrowX, setArrowX] = useState(0);
  const [arrowY, setArrowY] = useState(0);
  const [arrowAngle, setArrowAngle] = useState(0);

  // Update arrow position when progress changes
  useEffect(() => {
    if (!pathRef.current) return;

    // Get the point at the specified progress along the path
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(pathLength * progress);

    // Set the arrow position
    setArrowX(point.x);
    setArrowY(point.y);

    // Calculate the angle for rotation (tangent to the path)
    // We need to look a bit ahead on the path to get the direction
    const lookAhead = 0.01;
    const aheadPoint = path.getPointAtLength(
      Math.min(pathLength * (progress + lookAhead), pathLength)
    );
    const angle =
      Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x) *
      (180 / Math.PI);

    setArrowAngle(angle);
  }, [progress]);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div className="panel-label">
          Current Lap: &nbsp;
        {Math.max(0, props.distanceTraveled - distOffset) < trackLength
          ? 1
          : Math.trunc(
            Math.max(0, props.distanceTraveled - distOffset) / trackLength +
                1
          )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20vh',
          width: '18vw',
        }}
      >
        <svg
          id="map"
          viewBox="0 0 710 485"
          width={props.scale + '%'}
          height={props.scale + '%'}
          xmlns="http://www.w3.org/2000/svg"
          baseProfile="tiny"
          version="1.1"
        >
          <g transform="rotate(90, 400, 300)">
            <title>Layer 1</title>

            {/* Reference path (invisible) */}
            <path
              ref={pathRef}
              d={TRACKS[props.trackName as keyof typeof TRACKS].shape}
              fill="none"
              stroke="none"
              style={{ visibility: 'hidden' }}
            />

            {/* Visible track */}
            <motion.path
              id="svg_3"
              d={TRACKS[props.trackName as keyof typeof TRACKS].shape}
              fill="var(--color-gray)"
              strokeWidth="12"
              stroke="var(--color-green-highlight)"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={trackTransition}
            />
            {/* Arrow marker */}
            <polygon
              points="-22,-15 22,0 -22,15"
              fill="var(--color-tech)"
              transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
