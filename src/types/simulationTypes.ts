// Defined types to support simulation input
export enum SegmentType {
  BURN,
  COAST
}

export type RaceStrategy = Array<SimDataItem>;

export type SimDataItem = {
  timestamp: number;
  distance: number;
  segmentType: SegmentType;
}

export type Segment = {
  progress_percent: number;
  status: SegmentType;
}