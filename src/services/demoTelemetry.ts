/**
 * Demo data path.
 *
 * Generates plausible telemetry packets locally so the display can be run and
 * developed without the python data server. Packets have the exact shape the
 * server sends, so they travel through `buildHistoryPacket` like real data.
 *
 * The fake car follows the burn/coast plan in `SAMPLE_SIMULATION`, so the track
 * map, the burn/coast bar and the speedometer all agree with each other.
 */

import { CURRENT_TRACK, SAMPLE_SIMULATION, TRACKS } from '../constants';
import { RaceStrategy, SegmentType } from '../types/simulationTypes';
import type { IncomingPacket } from './dynamicTelemetry';

const MPH_TO_FEET_PER_SECOND = 5280 / 3600;

const TICK_MS = 100;

// Car behavior. Speeds are MPH, distances feet, temperatures Fahrenheit.
const BURN_TARGET_SPEED = 34;
const COAST_FLOOR_SPEED = 11;
const BURN_ACCELERATION = 4;
const COAST_DECELERATION = 1.4;
const ARM_LOOKAHEAD_DISTANCE = 400;

const IDLE_ENGINE_TEMP = 95;
const HOT_ENGINE_TEMP = 214;
const IDLE_RAD_TEMP = 90;
const HOT_RAD_TEMP = 186;
const ENGINE_TEMP_TAU = 12;
const RAD_TEMP_TAU = 28;

const NOMINAL_VOLTAGE = 26.4;
const BURN_VOLTAGE_SAG = 3.2;

// Number of packets the reset button stays held at the end of a race.
const RESET_PULSE_PACKETS = 3;

export type DemoTelemetryOptions = {
  /** Multiplies simulated time, so a full race can be watched in a minute. */
  timeScale?: number;
  /** Wall clock period between emitted packets. */
  intervalMs?: number;
  strategy?: RaceStrategy;
};

export type DemoRun = {
  /** Advances the simulation by `seconds` and returns the resulting packet. */
  step: (seconds: number) => IncomingPacket;
};

/**
 * Returns the planned segment type at a distance into the lap.
 */
function segmentTypeAt(strategy: RaceStrategy, lapDistance: number): SegmentType {
  let segmentType = strategy[0]?.segmentType ?? SegmentType.COAST;

  for (const point of strategy) {
    if (point.distance > lapDistance) {
      break;
    }
    segmentType = point.segmentType;
  }

  return segmentType;
}

/**
 * Returns the distance until the next burn begins, or Infinity when the plan
 * holds no further burn on this lap.
 */
function distanceToNextBurn(strategy: RaceStrategy, lapDistance: number): number {
  for (const point of strategy) {
    if (point.distance > lapDistance && point.segmentType === SegmentType.BURN) {
      return point.distance - lapDistance;
    }
  }

  return Infinity;
}

/**
 * Moves `value` toward `target` with a time constant of `tau` seconds.
 */
function approach(value: number, target: number, tau: number, seconds: number): number {
  return value + (target - value) * (1 - Math.exp(-seconds / tau));
}

function jitter(amount: number): number {
  return (Math.random() - 0.5) * 2 * amount;
}

/**
 * Creates a stateful demo race. Call `step` to advance it.
 * The race loops: finishing the last lap pulses the reset button and starts over.
 */
export function createDemoRun(strategy: RaceStrategy = SAMPLE_SIMULATION): DemoRun {
  const track = TRACKS[CURRENT_TRACK];
  const raceDistance = track.length * track.laps;

  let distance = 0;
  let speed = 0;
  let engineTemp = IDLE_ENGINE_TEMP;
  let radTemp = IDLE_RAD_TEMP;
  let windPhase = Math.random() * Math.PI * 2;
  let resetPacketsLeft = 0;

  return {
    step(seconds: number): IncomingPacket {
      const lapDistance = distance % track.length;
      const segment = segmentTypeAt(strategy, lapDistance);
      const burning = segment === SegmentType.BURN;

      const targetSpeed = burning ? BURN_TARGET_SPEED : COAST_FLOOR_SPEED;
      const rate = burning ? BURN_ACCELERATION : COAST_DECELERATION;
      const delta = Math.sign(targetSpeed - speed) * rate * seconds;
      speed =
        Math.abs(targetSpeed - speed) < Math.abs(delta)
          ? targetSpeed
          : speed + delta;
      speed = Math.max(0, speed + jitter(0.15));

      distance += speed * MPH_TO_FEET_PER_SECOND * seconds;

      engineTemp = approach(
        engineTemp,
        burning ? HOT_ENGINE_TEMP : IDLE_ENGINE_TEMP,
        ENGINE_TEMP_TAU,
        seconds
      );
      radTemp = approach(
        radTemp,
        burning ? HOT_RAD_TEMP : IDLE_RAD_TEMP,
        RAD_TEMP_TAU,
        seconds
      );

      // Gusty headwind riding on top of the car's own speed.
      windPhase += seconds * 0.35;
      const airspeed = Math.max(
        0,
        speed * 0.92 + 3 + Math.sin(windPhase) * 2.5 + jitter(0.4)
      );

      const armed =
        burning || distanceToNextBurn(strategy, lapDistance) <= ARM_LOOKAHEAD_DISTANCE;

      if (distance >= raceDistance) {
        distance = 0;
        speed = 0;
        resetPacketsLeft = RESET_PULSE_PACKETS;
      }

      const resetHeld = resetPacketsLeft > 0;
      if (resetHeld) {
        resetPacketsLeft -= 1;
      }

      return {
        time: new Date().toISOString(),
        speed: round(speed, 2),
        airspeed: round(airspeed, 2),
        distance_traveled: round(distance, 2),
        engine_temp: round(engineTemp, 1),
        rad_temp: round(radTemp, 1),
        voltage: round(
          NOMINAL_VOLTAGE - (burning ? BURN_VOLTAGE_SAG : 0) + jitter(0.12),
          2
        ),
        engine_on: burning ? 1 : 0,
        engine_armed: armed ? 1 : 0,
        timer_reset_button: resetHeld ? 1 : 0,
        toggle_time_button: 0,
      };
    },
  };
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/**
 * Starts feeding generated packets to `onPacket`. Returns a stop function.
 */
export function startDemoTelemetry(
  onPacket: (packet: IncomingPacket) => void,
  options: DemoTelemetryOptions = {}
): () => void {
  const intervalMs = options.intervalMs ?? TICK_MS;
  const timeScale = options.timeScale ?? 1;
  const run = createDemoRun(options.strategy);

  const interval = setInterval(() => {
    onPacket(run.step((intervalMs / 1000) * timeScale));
  }, intervalMs);

  return () => clearInterval(interval);
}

/**
 * Reads the demo switch from the URL, falling back to the REACT_APP_DEMO
 * environment variable.
 *
 * `?demo` runs in real time, `?demo=10` runs ten times faster. Returns null
 * when the display should talk to the real data server.
 */
export function getDemoTimeScale(search: string = window.location.search): number | null {
  const value =
    new URLSearchParams(search).get('demo') ?? process.env.REACT_APP_DEMO ?? null;

  if (value === null || value === 'false' || value === '0') {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
