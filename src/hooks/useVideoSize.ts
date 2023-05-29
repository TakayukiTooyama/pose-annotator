import { useCallback, useEffect, useState } from 'react';

import type { Dimensions } from '@/types';

export const useVideoSize = (
  videoRef: React.RefObject<HTMLVideoElement>,
  stageSize: Dimensions,
) => {
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const { width: stageWidth, height: stageHeight } = stageSize;
  const updateVideoSize = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const isTall = stageWidth / videoAspectRatio > stageHeight;
    const videoWidth = isTall ? stageHeight * videoAspectRatio : stageWidth;
    const videoHeight = isTall ? stageHeight : stageWidth / videoAspectRatio;

    setVideoSize({ width: videoWidth, height: videoHeight });
  }, [stageHeight, stageWidth, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    const handleLoadedMetadata = () => {
      updateVideoSize();
    };

    video?.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [stageWidth, videoRef, updateVideoSize]);

  useEffect(() => {
    updateVideoSize();
  }, [stageWidth, stageHeight, updateVideoSize]);

  return {
    videoSize,
  };
};
