import type { Dimensions, Frame } from '@/types';

export const useFrameSize = (stageSize: Dimensions, selectFrame: Frame) => {
  const frameWidth = selectFrame.dimensions.width;
  const frameHeight = selectFrame.dimensions.height;
  const frameAspectRatio = frameWidth / frameHeight;
  const isTall = stageSize.width / frameAspectRatio > stageSize.height;

  const stageFrameWidth = isTall ? stageSize.height * frameAspectRatio : stageSize.width;
  const stageFrameHeight = isTall ? stageSize.height : stageSize.width / frameAspectRatio;
  const frameSize = { width: stageFrameWidth, height: stageFrameHeight };

  const positionScale = {
    x: frameWidth / stageSize.width,
    y: frameHeight / (stageSize.width / frameAspectRatio),
  };

  return { frameSize, positionScale };
};
