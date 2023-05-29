import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useState } from 'react';

import { useVideo } from '@/store';
import { useCalibrationMarker } from '@/store/useCalibrationMarker';
import type { Marker, Position, Scale } from '@/types';

export const useCalibration = () => {
  const [isDraggable, setIsDraggable] = useState(true);
  const [mouseDownTime, setMouseDownTime] = useState(0);

  const {
    currentCalibrationMarkerIndex,
    markers,
    selectedCalibrationMarker,
    moveCalibrationMarkerIndex,
    updateCalibrationMarker,
    deleteCalibrationMarker,
  } = useCalibrationMarker();

  const { selectedVideo } = useVideo();

  const handleMouseDownImage = () => {
    setMouseDownTime(Date.now());
  };

  const handleCalibration = useCallback(
    (e: KonvaEventObject<MouseEvent>, selectedCalibrationMarker: Marker, scale: Scale) => {
      if (!selectedVideo) {
        return;
      }
      const newPosition: Position = {
        x: Math.round(e.target.getRelativePointerPosition().x * scale.x),
        y: Math.round(e.target.getRelativePointerPosition().y * scale.y),
      };
      updateCalibrationMarker(selectedVideo.name, selectedCalibrationMarker.label, newPosition);
      const lastMarker = currentCalibrationMarkerIndex === markers.length - 1;
      lastMarker
        ? moveCalibrationMarkerIndex(0)
        : moveCalibrationMarkerIndex(currentCalibrationMarkerIndex + 1);
    },
    [
      markers,
      selectedVideo,
      currentCalibrationMarkerIndex,
      updateCalibrationMarker,
      moveCalibrationMarkerIndex,
    ],
  );

  const handleMouseUpImage = (e: KonvaEventObject<MouseEvent>, scale: Scale) => {
    const timeDiff = Date.now() - mouseDownTime;
    if (timeDiff < 250) {
      handleCalibration(e, selectedCalibrationMarker, {
        x: scale.x,
        y: scale.y,
      });
    }
  };

  // 右クリックメニューを表示しない & マーカー削除
  const handleRightClick = (e: KonvaEventObject<MouseEvent>, selectedCalibrationMarker: Marker) => {
    e.evt.preventDefault();
    if (!selectedVideo) {
      return;
    }
    deleteCalibrationMarker(selectedVideo.name, selectedCalibrationMarker.label);
  };

  const handleDoubleTapCircle = (e: KonvaEventObject<Event>, selectedCalibrationMarker: Marker) => {
    e.evt.preventDefault();
    if (!selectedVideo) {
      return;
    }
    deleteCalibrationMarker(selectedVideo.name, selectedCalibrationMarker.label);
  };

  const handleHoverCircle = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      if (e.type === 'mouseenter') {
        stage.container().style.cursor = 'pointer';
      } else {
        stage.container().style.cursor = 'default';
      }
    }
  };

  const handleDragStartCircle = () => {
    setIsDraggable(false);
  };

  const handleDragEndCircle = (
    e: KonvaEventObject<DragEvent>,
    selectedCalibrationMarker: Marker,
    scale: Scale,
  ) => {
    if (!selectedVideo) {
      return;
    }
    setIsDraggable(true);
    const newPosition: Position = {
      x: Math.round(e.target.x() * scale.x),
      y: Math.round(e.target.y() * scale.y),
    };
    updateCalibrationMarker(selectedVideo.name, selectedCalibrationMarker.label, newPosition);
  };

  return {
    isDraggable,
    handleMouseDownImage,
    handleMouseUpImage,
    handleRightClick,
    handleDoubleTapCircle,
    handleHoverCircle,
    handleDragStartCircle,
    handleDragEndCircle,
    handleCalibration,
  };
};
