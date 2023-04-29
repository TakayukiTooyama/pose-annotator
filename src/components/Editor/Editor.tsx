/* eslint-disable import/no-default-export */
import { useElementSize, useToggle } from '@mantine/hooks';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { FC } from 'react';

import { CanvasEditor } from '@/components/Editor/Canvas';
import { MarkerEditor } from '@/components/Editor/Marker';
import { PlayerEditor } from '@/components/Editor/PlayerEditor';
import { useFrameMarkers } from '@/hooks/useFrameMarkers';
import { useMarkerSetting } from '@/hooks/useMarkerSetting';
import type { Frame, Marker, Position, Video } from '@/types';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvas: HTMLCanvasElement;
  videoUrl: string;
  videos: Video[];
  frames: Frame[];
  currentFrameIndex: number;
  currentVideoIndex: number;
  handleMoveFrameIndex: (index: number, isScroll?: boolean) => void;
  handleAddVideoFrames: (
    newFrame: Frame,
    videoElement: HTMLVideoElement,
    currentFrameNumber: number,
  ) => void;
};

const Editor: FC<Props> = ({
  videoRef,
  canvas,
  videoUrl,
  videos,
  frames,
  currentVideoIndex,
  currentFrameIndex,
  handleMoveFrameIndex,
  handleAddVideoFrames,
}) => {
  const selectFrame = frames[currentFrameIndex];
  const { markerSetting } = useMarkerSetting();

  const {
    markers,
    currentMarkerIndex,
    handleUpdateMarkers,
    handleMoveMarkerIndex,
    handleAddMarkers,
  } = useFrameMarkers(selectFrame);

  const { ref, width: stageWidth, height: stageHeight } = useElementSize();
  const [viewMode, toggleViewMode] = useToggle(['frameExtraction', 'annotation']);
  const [labelingMode, toggleLabelingMode] = useToggle(['allLabeling', 'oneLabeling']);

  const videoWidth = videoRef.current?.videoWidth;
  const videoHeight = videoRef.current?.videoHeight;
  const videoAspectRatio = (videoWidth || 16) / (videoHeight || 0);
  const isTall = stageWidth / videoAspectRatio > stageHeight - 80;
  const stageVideoWidth = isTall ? (stageHeight - 80) * videoAspectRatio : stageWidth;
  const stageVideoHeight = isTall ? stageHeight - 80 : stageWidth / videoAspectRatio;

  const handleLabeling = (
    e: KonvaEventObject<MouseEvent>,
    scale: { x: number; y: number },
    selectMarker: Marker,
  ) => {
    const lastMarker = currentMarkerIndex === markers.length - 1;
    const lastFrame = currentFrameIndex === frames.length - 1;

    const newPosition: Position = {
      x: Math.round(e.target.getRelativePointerPosition().x * scale.x),
      y: Math.round(e.target.getRelativePointerPosition().y * scale.y),
    };
    const newMarkers: Marker[] = markers.map((marker) => ({
      ...marker,
      position: marker.label === selectMarker.label ? newPosition : marker.position,
    }));
    handleUpdateMarkers(newMarkers);

    if (lastMarker && lastFrame) {
      handleMoveMarkerIndex(0);
      handleMoveFrameIndex(0);
    }
    if (labelingMode === 'allLabeling') {
      if (!lastMarker) {
        handleMoveMarkerIndex(currentMarkerIndex + 1);
      }
      if (lastMarker && !lastFrame) {
        handleMoveMarkerIndex(0);
        handleMoveFrameIndex(currentFrameIndex + 1);
      }
    } else {
      if (!lastFrame) {
        handleMoveFrameIndex(currentFrameIndex + 1, true);
      }
      if (lastFrame && !lastMarker) {
        handleMoveMarkerIndex(currentMarkerIndex + 1);
        handleMoveFrameIndex(0, true);
      }
    }
  };

  const handleCaptureVideoFrame = (video: HTMLVideoElement | null) => {
    if (!video) {
      return;
    }

    const currentFrameNumber = Number(Math.round(video.currentTime / 0.03).toString());
    const existingFrameIndex = frames.findIndex((frame) => frame.name === `${currentFrameNumber}`);

    if (existingFrameIndex !== -1) {
      return;
    }

    const newFrame: Frame = {
      id: `${videos[currentVideoIndex]?.name}-${currentFrameNumber}`,
      name: `${currentFrameNumber}`,
      videoName: videos[currentVideoIndex]?.name,
      size: 100,
      dimensions: { width: video.videoWidth, height: video.videoHeight },
    };
    handleAddVideoFrames(newFrame, video, currentFrameNumber);

    const newMarkers: Marker[] = markerSetting.options.map((option) => ({
      label: option.label,
      position: null,
    }));
    handleAddMarkers(newMarkers, newFrame);

    video.currentTime += 0.03;
  };

  return (
    <div className='flex flex-1 '>
      <MarkerEditor
        markers={markers}
        labelingMode={labelingMode}
        viewMode={viewMode}
        currentMarkerIndex={currentMarkerIndex}
        toggleViewMode={toggleViewMode}
        toggleLabelingMode={toggleLabelingMode}
        handleMoveMarkerIndex={handleMoveMarkerIndex}
        handleUpdateMarkers={handleUpdateMarkers}
      />
      <div className='flex flex-1 flex-col'>
        <div className='relative flex-1 overflow-hidden bg-black' ref={ref}>
          {videoUrl ? (
            <PlayerEditor
              viewMode={viewMode}
              videoUrl={videoUrl}
              videoRef={videoRef}
              stageVideoHeight={stageVideoHeight}
              stageVideoWidth={stageVideoWidth}
              onCaptureVideoFrame={handleCaptureVideoFrame}
            />
          ) : null}
          {viewMode === 'annotation' && selectFrame ? (
            <CanvasEditor
              markers={markers}
              currentMarkerIndex={currentMarkerIndex}
              frame={selectFrame}
              canvas={canvas}
              stageWidth={stageWidth}
              stageHeight={stageHeight - 80}
              handleUpdateMarkers={handleUpdateMarkers}
              handleLabeling={handleLabeling}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Editor;
