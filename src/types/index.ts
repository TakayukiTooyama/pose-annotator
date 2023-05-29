export type MarkerSetting = {
  radius: number;
  opacity: number;
  options: MarkerOption[];
};

// TODO:0.スティックの組み替え
// TODO:2.2次元4点実長換算
// TODO:3.マーカーありパンニング
// TODO:5.全フレーム抽出
// TODO:6.自動マーカー追跡
// TODO:7.出力形式の変更
// TODO:11.軌跡の描画
// TODO:12.グラフを描画（目的:アノテーションしていないマーカーをわかりやすく）

// TODO:4.マーカーなしパンニング
// TODO:8.チュートリアルの作成
// TODO:9.自動分析機能（ChatGPTを使用）

export type ProcessingMode = 'frameExtraction' | 'annotation' | 'calibration';
export type ExtractMode = 'allFrames' | 'selectFrame';
export type AnnotationMode = 'manualAllParts' | 'manualOnePart' | 'tracking';
export type CalibrationMode = 'static' | 'panningWithMarkers' | 'panningWithoutMarkers';

export type EditorMode = {
  processingMode: ProcessingMode;
  extractMode: ExtractMode;
  annotationMode: AnnotationMode;
  calibrationMode: CalibrationMode;
};

export type VideoFrames = Record<string, Frame[]>;
export type FrameMarkers = Record<string, Marker[]>;
export type CalibrationMarkers = Record<string, Marker[]>;

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

export type RealDimensions = {
  width: number | '';
  height: number | '';
};

export type Position = {
  x: number;
  y: number;
};

export type Scale = Position;
