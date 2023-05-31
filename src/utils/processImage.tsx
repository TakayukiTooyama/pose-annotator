import type { CV, Mat } from '@techstark/opencv-js';

const SEGMENT_DILATION_SIZE = [25, 25];
const DILATION_ITERATIONS = 1;
const COLOR_THRESHOLD = 5;
const HSV_MIN = 100;
const HSV_MAX = 255;

// トラックの色範囲を取得
export const getTrackColorRange = (color: number) => [
  [color - COLOR_THRESHOLD, HSV_MIN, HSV_MIN],
  [color + COLOR_THRESHOLD, HSV_MAX, HSV_MAX],
];

// 二次元配列を作成
export const create2DArray = (rows: number, cols: number, initialValue: number[]) =>
  new Array(rows).fill(0).map(() => new Array(cols).fill(initialValue));

// OpenCVのMatオブジェクトを削除
export const deleteMatObjects = (...mats: Mat[]) => {
  mats.forEach((mat) => mat && mat.delete());
};

// 画像をHSV形式に変換
export const convertToHSV = (cv: CV, img: Mat) => {
  const hsvImg = new cv.Mat();
  cv.cvtColor(img, hsvImg, cv.COLOR_BGR2HSV);
  return hsvImg;
};

export const dilateMask = (cv: CV, mask: Mat) => {
  const dilatedMask = new cv.Mat();
  const kernel = cv.Mat.ones(SEGMENT_DILATION_SIZE[0], SEGMENT_DILATION_SIZE[1], cv.CV_8U);
  const anchor = new cv.Point(-1, -1);
  cv.dilate(mask, dilatedMask, kernel, anchor, DILATION_ITERATIONS);
  kernel.delete();
  return dilatedMask;
};

// truckColor = Hue（色相）: 色の種類を表し、赤や青、黄などの色の違いを指す
export const truckMask = (hsvImg: Mat, truckColor: number) => {
  const lowerTrack = [truckColor - COLOR_THRESHOLD, HSV_MIN, HSV_MIN];
  const upperTrack = [truckColor + COLOR_THRESHOLD, HSV_MAX, HSV_MAX];
  const mask = new cv.Mat();
  const low = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), lowerTrack);
  const high = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), upperTrack);
  cv.inRange(hsvImg, low, high, mask);
  const dilatedMask = new cv.Mat();
  const kernel = cv.Mat.ones(SEGMENT_DILATION_SIZE[0], SEGMENT_DILATION_SIZE[1], cv.CV_8U);
  cv.dilate(mask, dilatedMask, kernel, new cv.Point(-1, -1), DILATION_ITERATIONS);

  return dilatedMask;
};

export const maskMarker = (hsvImg: any, canvas: any, markerColor: number) => {
  const lowerMarker = [markerColor - 5, 50, 50];
  const upperMarker = [markerColor + 5, 255, 255];
  const low = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), lowerMarker);
  const high = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), upperMarker);
  const maskMarker = new cv.Mat();
  const hsv = new cv.Mat();
  cv.cvtColor(canvas, hsv, cv.COLOR_BGR2HSV);
  cv.inRange(hsv, low, high, maskMarker);

  return maskMarker;
};

export const maskLine = (hsvImg: any, canvas: any) => {
  const lowerWhite = [0, 0, 200];
  const upperWhite = [180, 255, 255];
  const low = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), lowerWhite);
  const high = new cv.Mat(hsvImg.rows, hsvImg.cols, hsvImg.type(), upperWhite);
  const maskLine = new cv.Mat();
  const hsv = new cv.Mat();
  cv.cvtColor(canvas, hsv, cv.COLOR_BGR2HSV);
  cv.inRange(hsv, low, high, maskLine);

  return maskLine;
};

export const findMarkers = (mask: any) => {
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  const markers = [];
  const MIN_CONTOUR_AREA = 100;
  for (let i = 0; i < Number(contours.size()); i++) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    if (area > MIN_CONTOUR_AREA) {
      const rect = cv.boundingRect(contour);
      const marker = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        area,
      };
      markers.push(marker);
    }
  }

  return markers;
};
