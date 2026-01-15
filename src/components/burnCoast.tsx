/* eslint-disable linebreak-style */
import { JSX, useEffect, useRef, useState } from 'react';
import { CURRENT_TRACK, TRACKS } from '../constants';
import { RaceStrategy, Segment, SegmentType } from '../types/simulationTypes';

// Convert simulation output to progress bar format for a single lap
function convertSimulationToProgress(simulation: RaceStrategy, trackLength: number): Array<Segment> {
  if (!simulation || simulation.length === 0) return [];
  
  const segments: Array<Segment> = [];
  let currentStatus = simulation[0].segmentType;
  let segmentStartDist = simulation[0].distance;
  
  for (let i = 1; i < simulation.length; i++) {
    if (simulation[i].segmentType !== currentStatus) {
      // End current segment
      const segmentEndDist = simulation[i].distance;
      const progressPercent = ((segmentEndDist - segmentStartDist) / trackLength) * 100;
      segments.push({ progress_percent: progressPercent, status: currentStatus });
      
      // Start new segment
      currentStatus = simulation[i].segmentType;
      segmentStartDist = segmentEndDist;
    }
  }
  
  // Add final segment
  const finalDist = simulation[simulation.length - 1].distance;
  const progressPercent = ((finalDist - segmentStartDist) / trackLength) * 100;
  segments.push({ progress_percent: progressPercent, status: currentStatus });
  
  return segments;
}

export default function BurnCoast(props: {
  simulationOutput?: RaceStrategy;
  currentDistance: number;
  currentStatus: SegmentType;
  resetTriggered?: boolean;
}): JSX.Element {
  const { simulationOutput, currentDistance, currentStatus, resetTriggered } = props;

  // State variables to keep track of the live race segments
  const [prevDist, setPrevDist] = useState<number>(0);
  const [newRaceOffset, setNewRaceOffset] = useState<number>(0);
  const prevStatusRef = useRef<SegmentType>(currentStatus);
  const [liveProgress, setLiveProgress] = useState<Array<Array<Segment>>>([[{progress_percent: 0, status: currentStatus}]]);
  const [simulatedProgress, setSimulatedProgress] = useState<Array<Segment>>([]);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [currentLap, setCurrentLap] = useState<number>(1);

  // Convert simulation output when it changes
  useEffect(() => {
    if (simulationOutput && simulationOutput.length > 0) {
      const simProgress = convertSimulationToProgress(simulationOutput, TRACKS[CURRENT_TRACK].length);
      setSimulatedProgress(simProgress);
    }
  }, [simulationOutput]);

  // Reset key state values when a new race is started
  useEffect(() => {
    if (resetTriggered) {
      console.log('New race started');
      setNewRaceOffset(currentDistance);
      setPrevDist(currentDistance); // Set to current distance, not 0
      setLiveProgress([[{progress_percent: 0, status: currentStatus}]]);
      setCurrentSegment(0);
      setCurrentLap(1);
      prevStatusRef.current = currentStatus;
    }
  }, [resetTriggered, currentDistance, currentStatus]);

  // When the current distance traveled changes, calculate the additional progress that was made.
  // Do not update any longer once a race has been complete.
  useEffect(() => {
    if (currentLap < TRACKS[CURRENT_TRACK].laps + 1) {
      const adjustedCurrentDist = currentDistance - newRaceOffset;
      const adjustedPrevDist = prevDist - newRaceOffset;
      const distDelta = adjustedCurrentDist - adjustedPrevDist;
      const progressMade = (distDelta / TRACKS[CURRENT_TRACK].length) * 100; // in percent
      const segments = [...liveProgress];

      const newLap = Math.trunc(Math.max(0, adjustedCurrentDist / TRACKS[CURRENT_TRACK].length)) + 1;

      let segmentIndex = currentSegment;

      // If we have moved into a new lap, create a new lap array
      if (segments.length < newLap) {
        segments.push([{progress_percent: 0, status: currentStatus}]);
        segmentIndex = 0;
        setCurrentSegment(0);
      }

      // If a new state occurred, create a new segment and point to it
      if (prevStatusRef.current !== currentStatus) {
        segments[newLap - 1].push({progress_percent: 0, status: currentStatus});
        prevStatusRef.current = currentStatus;
        segmentIndex = segmentIndex + 1;
      }

      // Safety check: ensure the lap and segment exist
      if (segments[newLap - 1] && segments[newLap - 1][segmentIndex]) {
        // Modify the current segment with the new progress
        segments[newLap - 1][segmentIndex].progress_percent += progressMade;
      }

      setLiveProgress(segments);
      setCurrentSegment(segmentIndex);
      setPrevDist(currentDistance); // Store actual distance, not adjusted
      setCurrentLap(newLap);
    }
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
            {simulatedProgress.map((val, key) => (
              <div key={key} className={`${val.status === SegmentType.COAST ? 'simulated-done' : 'simulated-burn'}`} style={{width: `${val.progress_percent}%`}}></div>
            ))}
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
