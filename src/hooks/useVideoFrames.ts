import { useLocalStorage } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFrameMarkers } from '@/hooks/useFrameMarkers';
import type { Frame, FrameMarkers, Video, VideoFrames } from '@/types';
import { createCanvasFromVideo, extractFrame } from '@/utils';

const FRAME_ASPECT_RATIO = 9 / 16;
const FRAME_HEIGHT = 128;

export const useVideoFrames = (selectedVideo: Video) => {
  const [videoFrames, setVideoFrames, removeVideoFrames] = useLocalStorage<VideoFrames>({
    key: 'videoFrames',
    defaultValue: {},
  });
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const frames = useMemo(
    () => videoFrames[selectedVideo?.name] || [],
    [videoFrames, selectedVideo],
  );

  const { handleDeleteFrameMarkersWithFrame } = useFrameMarkers(frames[currentFrameIndex]);

  /* currentFrameIndex */
  const _handleScrollToSelectFrame = useCallback((index: number) => {
    const scrollPosition = (FRAME_HEIGHT / FRAME_ASPECT_RATIO) * index;

    viewportRef.current?.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }, []);

  const handleSelectFrameIndex = useCallback(
    (index: number, isScroll?: boolean) => {
      setCurrentFrameIndex(index);

      if (isScroll) {
        _handleScrollToSelectFrame(index);
      }
    },
    [_handleScrollToSelectFrame],
  );

  const handleMoveFrameIndex = useCallback(
    (index: number, isScroll?: boolean) => {
      if (isScroll) {
        _handleScrollToSelectFrame(index);
      }
      if (index < 0 || index === frames.length) {
        return;
      }
      handleSelectFrameIndex(index);
    },
    [frames, handleSelectFrameIndex, _handleScrollToSelectFrame],
  );

  /* frame */
  const _handleAddFrame = useCallback(
    (newFrame: Frame, nextFrameIndex: number) => {
      setVideoFrames((prev) => {
        const currentFrames = prev[selectedVideo?.name] || [];

        if (nextFrameIndex !== -1) {
          return {
            ...prev,
            [selectedVideo?.name]: [
              ...currentFrames.slice(0, nextFrameIndex),
              newFrame,
              ...currentFrames.slice(nextFrameIndex),
            ],
          };
        } else {
          return {
            ...prev,
            [selectedVideo?.name]: [...currentFrames, newFrame],
          };
        }
      });
    },
    [selectedVideo, setVideoFrames],
  );

  const _handleDeleteFrame = useCallback(
    (deleteIndex: number) => {
      const newFrames = frames.filter((_, index) => index !== deleteIndex);
      setVideoFrames((prev) => ({
        ...prev,
        [selectedVideo?.name]: newFrames,
      }));
    },
    [frames, selectedVideo, setVideoFrames],
  );

  /* canvas */
  const _handleAddCanvas = useCallback((videoElement: HTMLVideoElement, nextFrameIndex: number) => {
    const canvas = createCanvasFromVideo(videoElement);
    setCanvases((prev) => {
      if (nextFrameIndex !== -1) {
        return [...prev.slice(0, nextFrameIndex), canvas, ...prev.slice(nextFrameIndex)];
      } else {
        return [...prev, canvas];
      }
    });
  }, []);

  const _handleDeleteCanvas = useCallback(
    (deleteIndex: number) => {
      const newCanvases = canvases.filter((_, index) => index !== deleteIndex);
      setCanvases(newCanvases);
    },
    [canvases],
  );

  const extractFrames = useCallback(async (video: HTMLVideoElement, times: number[]) => {
    const canvases = [];
    for (const time of times) {
      const canvas = await extractFrame(video, time);
      canvases.push(canvas);
    }
    video.currentTime = 0;
    return canvases;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || frames.length === 0) {
      return;
    }
    video.src = URL.createObjectURL(selectedVideo?.file);
    video.muted = true;
    video.load();
    const handleLoadedData = async () => {
      const times = frames.map((frame) => parseFloat((Number(frame.name) / 30).toFixed(2)));
      const extractedCanvases = await extractFrames(video, times);
      setCanvases(extractedCanvases);
    };
    video.addEventListener('loadeddata', handleLoadedData);
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideo]);

  /* common */
  const handleAddVideoFrames = useCallback(
    (newFrame: Frame, videoElement: HTMLVideoElement, currentFrameNumber: number) => {
      const nextFrameIndex = frames.findIndex((frame) => Number(frame.name) > currentFrameNumber);
      _handleAddFrame(newFrame, nextFrameIndex);
      _handleAddCanvas(videoElement, nextFrameIndex);
      if (nextFrameIndex === -1) {
        handleSelectFrameIndex(frames.length, true);
      } else {
        handleSelectFrameIndex(nextFrameIndex, true);
      }
    },
    [frames, handleSelectFrameIndex, _handleAddFrame, _handleAddCanvas],
  );

  const handleDeleteVideoFrames = useCallback(
    (currentFrameIndex: number) => {
      if (frames.length === 0) {
        return;
      }
      // この時にframeMarkerも一緒に削除しなければならない
      const deleteIndex = frames.findIndex((frame) => frame.id === frames[currentFrameIndex].id);
      _handleDeleteFrame(deleteIndex);
      _handleDeleteCanvas(deleteIndex);
      handleDeleteFrameMarkersWithFrame(frames[deleteIndex].id);

      // 紐付いているframeMarkerも削除する
      const currentValue = localStorage.getItem('frameMarkers');
      if (currentValue) {
        const frameMarkers: FrameMarkers = JSON.parse(currentValue);
        const filteredFrameMarkers = Object.fromEntries(
          Object.entries(frameMarkers).filter(([key]) => key !== frames[currentFrameIndex].id),
        );

        localStorage.setItem('frameMarkers', JSON.stringify(filteredFrameMarkers));
      }

      // 削除したフレームが最後のフレームだった場合は、一つ前のフレームを選択する
      if (frames.length === deleteIndex + 1) {
        handleSelectFrameIndex(deleteIndex - 1, true);
      }
    },
    [
      frames,
      handleDeleteFrameMarkersWithFrame,
      handleSelectFrameIndex,
      _handleDeleteFrame,
      _handleDeleteCanvas,
    ],
  );

  return {
    viewportRef,
    videoRef,
    frames,
    canvases,
    videoFrames,
    currentFrameIndex,
    handleAddVideoFrames,
    handleDeleteVideoFrames,
    removeVideoFrames,
    handleSelectFrameIndex,
    handleMoveFrameIndex,
  };
};
