import { Button } from '@mantine/core';
import type { Dispatch, FC, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';

import { usePersistedMarkerStore } from '@/store';
import type { Frame, Video } from '@/types';
import { byteCount } from '@/utils';

type Props = {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;

  frames: Frame[];
  videos: Video[];
  selectVideoIndex: number;
  setFrames: Dispatch<SetStateAction<Frame[]>>;
  setFrameUrl: Dispatch<SetStateAction<string[]>>;
};

export const PlayerOperation: FC<Props> = ({
  videoRef,
  canvasRef,
  videos,
  selectVideoIndex,
  frames,
  setFrameUrl,
  setFrames,
}) => {
  const { markers } = usePersistedMarkerStore();

  const handleCaptureVideoFrame = (
    video: HTMLVideoElement | null,
    canvas: HTMLCanvasElement | null,
  ) => {
    if (!video || !canvas) {
      return;
    }

    const frameId = Math.round(video.currentTime / 0.03).toString();
    const existingFrameIndex = frames.findIndex((frame) => frame.name === frameId);

    if (existingFrameIndex !== -1) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(video, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg');
    const newFrame: Frame = {
      id: uuid(),
      name: frameId,
      videoName: videos[selectVideoIndex]?.name,
      size: byteCount(dataURL),
      dimensions: { width: video.videoWidth, height: video.videoHeight },
      markers: markers.map((marker) => ({ label: marker.label, position: null })),
    };
    const nextFrameIndex = frames.findIndex((frame) => Number(frame.name) > Number(frameId));
    if (nextFrameIndex !== -1) {
      setFrameUrl((prev) => [
        ...prev.slice(0, nextFrameIndex),
        dataURL,
        ...prev.slice(nextFrameIndex),
      ]);
      setFrames((prev) => [
        ...prev.slice(0, nextFrameIndex),
        newFrame,
        ...prev.slice(nextFrameIndex),
      ]);
    } else {
      setFrameUrl((prev) => [...prev, dataURL]);
      setFrames((prev) => [...prev, newFrame]);
    }

    video.currentTime += 0.03;
  };

  return (
    <Button
      variant='default'
      onClick={() => handleCaptureVideoFrame(videoRef.current, canvasRef.current)}
    >
      スクショ
    </Button>
  );
};
