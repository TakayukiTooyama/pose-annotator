import type { CV } from '@techstark/opencv-js';
import { useRef } from 'react';

import {
  convertToHSV,
  create2DArray,
  deleteMatObjects,
  dilateMask,
  getTrackColorRange,
} from '@/utils/processImage';

export const usePanningCalibration = (canvas: HTMLCanvasElement, cv: CV) => {
  const processedImage = useRef<HTMLCanvasElement>(null);

  const processImage = (truckColor: number): void => {
    if (!processedImage.current) {
      return;
    }

    const img = cv.imread(canvas);
    const hsvImg = convertToHSV(cv, img);

    // トラックの色以外をマスク
    const [lowerTrack, upperTrack] = getTrackColorRange(truckColor);
    const lowArray = create2DArray(hsvImg.rows, hsvImg.cols, lowerTrack);
    const highArray = create2DArray(hsvImg.rows, hsvImg.cols, upperTrack);
    const low = cv.matFromArray(hsvImg.rows, hsvImg.cols, cv.CV_8UC3, lowArray.flat());
    const high = cv.matFromArray(hsvImg.rows, hsvImg.cols, cv.CV_8UC3, highArray.flat());
    const mask = new cv.Mat();
    cv.inRange(hsvImg, low, high, mask);
    const dilatedMask = dilateMask(cv, mask);

    // 画像 + マスク
    const imgMasked = new cv.Mat();
    img.copyTo(imgMasked, dilatedMask);
    cv.imshow(processedImage.current, imgMasked);

    deleteMatObjects(img, hsvImg);
  };

  return { processedImage, processImage };
};
