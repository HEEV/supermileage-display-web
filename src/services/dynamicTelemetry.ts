/**
 * This file contains the helper functions required to parse the incoming data packets from the python server. We are assuming here that the data in the packet already has the proper labels applied and have been modified according to the config.
 * We do not handle config on this side of things, and the packet content is considered authoritative.
 */

export type HistoryData = {
  time?: Date;
  speed: number;
  airspeed: number;
  distance_traveled: number;
  engine_temp: number;
  rad_temp: number;
  [key: string]: unknown;
};

export type HistoryPacket = HistoryData;

export type IncomingPacket = {
  time?: string | Date;
  [key: string]: unknown;
};

const REQUIRED_NUMERIC_FIELDS = new Set<string>([
  'speed',
  'airspeed',
  'distance_traveled',
  'engine_temp',
  'rad_temp',
]);

/**
 * Returns a finite numeric value, or a fallback when the input is not a valid number.
 */
function getNumberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Returns a finite numeric value, or undefined when the input is not a valid number.
 */
export function getOptionalNumberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Normalizes telemetry status values into a boolean on/off state.
 * Returns undefined when the value is missing.
 * Treats numeric 1 and boolean true as truthy.
 */
export function isTruthyStatus(value: unknown): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return value === 1 || value === true;
}

/**
 * Builds a normalized history packet from incoming data.
 * Parses time when present.
 */
export function buildHistoryPacket(data: IncomingPacket): HistoryPacket {
  const packet: HistoryPacket = {
    speed: getNumberValue(data.speed),
    airspeed: getNumberValue(data.airspeed),
    distance_traveled: getNumberValue(data.distance_traveled),
    engine_temp: getNumberValue(data.engine_temp),
    rad_temp: getNumberValue(data.rad_temp),
  };

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'time' || REQUIRED_NUMERIC_FIELDS.has(key)) {
      return;
    }

    packet[key] = value;
  });

  if (data.time !== undefined) {
    const parsedTime = new Date(data.time);
    if (!Number.isNaN(parsedTime.valueOf())) {
      packet.time = parsedTime;
    }
  }

  return packet;
}
