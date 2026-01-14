/* eslint-disable linebreak-style */
import { JSX, useEffect, useRef, useState } from 'react';
import { CURRENT_TRACK, TRACKS } from '../constants';

// Defined types to support simulation input
export enum SegmentType {
  BURN,
  COAST
}

export type RaceStrategy = Array<{
  timestamp: number;
  distance: number;
  segmentType: SegmentType;
}>;

type Segment = {
  progress_percent: number;
  status: SegmentType;
}

export default function BurnCoast(props: {
  simulationOutput?: RaceStrategy;
  currentDistance?: number;
  currentStatus: SegmentType;
}): JSX.Element {
  const currDistance = props.currentDistance || 0;
  const currStatus = props.currentStatus;
  // TODO: integrate race strategy into the second bar
  const raceStrat = props.simulationOutput;

  // State variables to keep track of the live race segments
  const [prevDist, setPrevDist] = useState<number>(0);
  const prevStatusRef = useRef<SegmentType>(currStatus);
  // Array of laps, each lap is an array of segments
  const [liveProgress, setLiveProgress] = useState<Array<Array<Segment>>>([[{progress_percent: 0, status: currStatus}]]);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  // TODO: Set up lap counting to handle bottom bar
  const [currentLap, setCurrentLap] = useState<number>(1);

  // When the current distance traveled changes, calculate the additional progress that was made.
  useEffect(() => {
    const distDelta = currDistance - prevDist;
    const progressMade = (distDelta / TRACKS[CURRENT_TRACK].length) * 100; // in percent
    const segments = [...liveProgress];

    const newLap = Math.trunc(Math.max(0, currDistance / TRACKS[CURRENT_TRACK].length)) + 1;

    let segmentIndex = currentSegment;

    // If we have moved into a new lap, create a new lap array
    if (segments.length < newLap) {
      segments.push([{progress_percent: 0, status: currStatus}]);
      segmentIndex = 0;
      setCurrentSegment(0);
    }

    // If a new state occurred, create a new segment and point to it
    if (prevStatusRef.current !== currStatus) {
      segments[newLap - 1].push({progress_percent: 0, status: currStatus});
      prevStatusRef.current = currStatus;
      segmentIndex = segmentIndex + 1;
    }

    // Modify the current segment with the new progress
    segments[newLap - 1][segmentIndex].progress_percent += progressMade;

    setLiveProgress(segments);
    setCurrentSegment(segmentIndex);
    setPrevDist(currDistance);
    setCurrentLap(newLap);
  }, [props.currentDistance, props.currentStatus]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{display: 'flex', flexDirection: 'row'}}> {/* first row, current lap actual */ }
          <div className="lap-single">
            {liveProgress[currentLap - 1]?.map((val, key) => {
              return (<div key={key} className={`${val.status === SegmentType.COAST ? 'actual-done' : 'actual-burn'}`} style={{width: `${val.progress_percent}%`}}></div>);
            })}
          </div>
          <div style={{backgroundColor: 'white'}}></div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}> {/* second row, current lap simulated */ }
          <div className="lap-single">
            <div className="simulated-done" style={{width: '30%'}}></div>
            <div className="simulated-burn" style={{width: '5%'}}></div>
            <div className="simulated-done" style={{width: '20%'}}></div>
          </div>
          <div></div>
        </div>
        {}
        <div style={{display: 'flex', flexDirection: 'row', marginTop: '0.5em'}}> {/* third row, full race actual */ }
          {Array.from({ length: TRACKS[CURRENT_TRACK].laps }, (_, lapIndex) => (
            <div key={lapIndex} className="lap-double">
              {liveProgress[lapIndex]?.map((val, key) => (
                <div key={key} className={`${val.status === SegmentType.COAST ? 'actual-done' : 'actual-burn'}`} style={{width: `${val.progress_percent}%`}}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}
