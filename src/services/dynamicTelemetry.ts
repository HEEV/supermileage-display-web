export type HistoryData = {
  time?: Date;
  speed?: number;
  airspeed?: number;
  distance_traveled?: number;
  engine_temp?: number;
  rad_temp?: number;
  [key: string]: unknown;
};

export type HistoryPacket = HistoryData;

export type IncomingPacket = {
  time?: string | Date;
  [key: string]: unknown;
};

type CarConfig = {
  cars?: Record<
    string,
    {
      active?: boolean;
      sensors?: Record<
        string,
        {
          name?: string;
        }
      >;
    }
  >;
};

export const STATIC_HISTORY_FIELDS = new Set<string>([
  'time',
  'speed',
  'airspeed',
  'distance_traveled',
  'engine_temp',
  'rad_temp',
]);

let allowedPacketFields = new Set<string>(STATIC_HISTORY_FIELDS);
let hasConfigDynamicFields = false;

/**
 * Returns a finite numeric value, or a fallback when the input is not a valid number.
 */
export function getNumberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Normalizes telemetry status values into a boolean on/off state.
 * Treats numeric 1 and boolean true as truthy.
 */
export function isTruthyStatus(value: unknown): boolean {
  return value === 1 || value === true;
}

/**
 * Loads active car sensor field names from config and merges them with static fields.
 * Falls back to static fields when config cannot be loaded.
 */
export async function initializePacketFields(): Promise<void> {
  try {
    const response = await fetch('/config/car_config.json');

    if (!response.ok) {
      allowedPacketFields = new Set<string>(STATIC_HISTORY_FIELDS);
      hasConfigDynamicFields = false;
      return;
    }

    const config = (await response.json()) as CarConfig;
    const dynamicFields = new Set<string>();

    Object.values(config.cars ?? {}).forEach((car) => {
      if (!car.active) {
        return;
      }

      Object.values(car.sensors ?? {}).forEach((sensor) => {
        if (sensor.name) {
          dynamicFields.add(sensor.name);
        }
      });
    });
    hasConfigDynamicFields = dynamicFields.size > 0;

    allowedPacketFields = new Set<string>([
      ...Array.from(STATIC_HISTORY_FIELDS),
      ...Array.from(dynamicFields),
    ]);
  } catch (error) {
    // Keep static fields only if config is unavailable.
    console.warn('Config load failed; dynamic fields will be discovered from incoming packets.', error);
    allowedPacketFields = new Set<string>(STATIC_HISTORY_FIELDS);
    hasConfigDynamicFields = false;
  }
}

/**
 * Builds a normalized history packet using currently configured allowed fields.
 * Parses time when present.
 */
export function buildHistoryPacket(data: IncomingPacket): HistoryPacket {
  const packet: HistoryPacket = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'time') {
      return;
    }

    if (allowedPacketFields.has(key)) {
      packet[key] = value;
      return;
    }

    // If config did not provide dynamic fields, treat incoming keys as valid telemetry.
    if (!hasConfigDynamicFields) {
      allowedPacketFields.add(key);
      packet[key] = value;
    }
  });

  if (data.time !== undefined) {
    const parsedTime = new Date(data.time);
    if (!Number.isNaN(parsedTime.valueOf())) {
      packet.time = parsedTime;
    }
  }

  return packet;
}
