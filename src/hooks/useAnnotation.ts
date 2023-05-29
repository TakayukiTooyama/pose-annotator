import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useState } from 'react';

import { useFrame, useMarker } from '@/store';
import type { Marker, Position, Scale } from '@/types';

export const useAnnotation = () => {
  const [isDraggable, setIsDraggable] = useState(true);
  const [mouseDownTime, setMouseDownTime] = useState(0);

  const {
    currentMarkerIndex,
    markers,
    selectedMarker,
    moveMarkerIndex,
    updateMarker,
    deleteMarker,
  } = useMarker();
  const { currentFrameIndex, frames, selectedFrame, moveFrameIndex } = useFrame();

  const handleMouseDownImage = () => {
    setMouseDownTime(Date.now());
  };

  const moveFrameAndMarkerIndex = useCallback(
    (annotationMode: string) => {
      const lastMarker = currentMarkerIndex === markers.length - 1;
      const lastFrame = currentFrameIndex === frames.length - 1;

      if (annotationMode === 'manualAllParts') {
        if (!lastMarker) {
          moveMarkerIndex(currentMarkerIndex + 1);
        }
        if (lastMarker && !lastFrame) {
          moveMarkerIndex(0);
          moveFrameIndex(currentFrameIndex + 1);
        }
      } else {
        if (!lastFrame) {
          moveFrameIndex(currentFrameIndex + 1);
        }
        if (lastFrame && !lastMarker) {
          moveMarkerIndex(currentMarkerIndex + 1);
          moveFrameIndex(0);
        }
      }
      if (lastFrame && lastMarker) {
        moveMarkerIndex(0);
        moveFrameIndex(0);
      }
    },
    [markers, frames, currentMarkerIndex, currentFrameIndex, moveMarkerIndex, moveFrameIndex],
  );

  const handleAnnotation = useCallback(
    (
      e: KonvaEventObject<MouseEvent>,
      selectedMarker: Marker,
      scale: Scale,
      annotationMode: string,
    ) => {
      const newPosition: Position = {
        x: Math.round(e.target.getRelativePointerPosition().x * scale.x),
        y: Math.round(e.target.getRelativePointerPosition().y * scale.y),
      };
      updateMarker(selectedFrame.id, selectedMarker.label, newPosition);
      moveFrameAndMarkerIndex(annotationMode);
    },
    [selectedFrame, updateMarker, moveFrameAndMarkerIndex],
  );

  const handleMouseUpImage = (
    e: KonvaEventObject<MouseEvent>,
    scale: Scale,
    annotationMode: string,
  ) => {
    const timeDiff = Date.now() - mouseDownTime;
    if (timeDiff < 250) {
      handleAnnotation(
        e,
        selectedMarker,
        {
          x: scale.x,
          y: scale.y,
        },
        annotationMode,
      );
    }
  };

  // 右クリックメニューを表示しない & マーカー削除
  const handleRightClick = (e: KonvaEventObject<MouseEvent>, selectedMarker: Marker) => {
    e.evt.preventDefault();
    deleteMarker(selectedFrame.id, selectedMarker.label);
  };

  const handleDoubleTapCircle = (e: KonvaEventObject<Event>, selectedMarker: Marker) => {
    e.evt.preventDefault();
    deleteMarker(selectedFrame.id, selectedMarker.label);
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
    selectedMarker: Marker,
    scale: Scale,
  ) => {
    setIsDraggable(true);
    const newPosition: Position = {
      x: Math.round(e.target.x() * scale.x),
      y: Math.round(e.target.y() * scale.y),
    };
    updateMarker(selectedFrame.id, selectedMarker.label, newPosition);
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
    handleAnnotation,
  };
};
