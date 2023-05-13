export const defaultMarkerOption: MarkerOption[] = [
  { id: '0', label: 'REar', color: '#D000FF' },
  { id: '1', label: 'RShoulder', color: '#564E00' },
  { id: '2', label: 'RElbow', color: '#AB9A00' },
  { id: '3', label: 'RWrist', color: '#D5C000' },
  { id: '4', label: 'RIndex', color: '#FFE500' },
  { id: '5', label: 'RHip', color: '#003C5D' },
  { id: '6', label: 'RKnee', color: '#005786' },
  { id: '7', label: 'RAnkle', color: '#0071AE' },
  { id: '8', label: 'RHeel', color: '#008CD7' },
  { id: '9', label: 'RFootIndex', color: '#00A6FF' },
  { id: '10', label: 'LEar', color: '#8B00D6' },
  { id: '11', label: 'LShoulder', color: '#642B00' },
  { id: '12', label: 'LElbow', color: '#B24D00' },
  { id: '13', label: 'LWrist', color: '#D95E00' },
  { id: '14', label: 'LIndex', color: '#FF6F00' },
  { id: '15', label: 'LHip', color: '#000753' },
  { id: '16', label: 'LKnee', color: '#000B7E' },
  { id: '17', label: 'LAnkle', color: '#000EA9' },
  { id: '18', label: 'LHeel', color: '#0012D4' },
  { id: '19', label: 'LFootIndex', color: '#0015FF' },
];

export const defaultMarkerSetting: MarkerSetting = {
  radius: 3,
  opacity: 0.9,
  options: defaultMarkerOption,
};

export type MarkerSetting = {
  radius: number;
  opacity: number;
  options: MarkerOption[];
};

export type VideoFrames = Record<string, Frame[]>;

export type FrameMarkers = Record<string, Marker[]>;

export type MarkerOption = {
  id: string;
  label: string;
  color: string;
};

export type Video = {
  id: string;
  name: string;
  file: File;
};

export type Frame = {
  id: string;
  name: string;
  dimensions: Dimensions;
  videoName: string;
};

export type Marker = {
  label: string;
  position: Position | null;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Scale = Position;
