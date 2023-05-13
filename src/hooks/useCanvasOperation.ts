import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';

import type { Dimensions } from '@/types';

export const useCanvasOperation = (stageSize: Dimensions, frameSize: Dimensions) => {
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const [, setGroupPosition] = useState({ x: 0, y: 0 });

  const handleZoom = (e: KonvaEventObject<WheelEvent>) => {
    const scaleBy = 1.08;
    if (!stageRef.current) {
      return;
    }
    e.evt.preventDefault();
    const oldScale = stageRef.current.scaleX();
    const pointer = stageRef.current.getPointerPosition();

    if (!pointer) {
      return;
    }
    const mousePointTo = {
      x: (pointer.x - stageRef.current.x()) / oldScale,
      y: (pointer.y - stageRef.current.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;

    const getNewScale = () => {
      if (direction > 0) {
        return oldScale * scaleBy;
      }
      if (direction < 0 && oldScale < 1.01) {
        return oldScale;
      }
      return oldScale / scaleBy;
    };
    const newScale = getNewScale();
    stageRef.current.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stageRef.current.position(newPos);
  };

  const handleFitImage = () => {
    stageRef.current?.scale({ x: 1, y: 1 });
    groupRef.current?.position({ x: stageSize.width / 2, y: stageSize.height / 2 });
    stageRef.current?.position({ x: -frameSize.width / 2, y: -frameSize.height / 2 });
  };

  const handleDragEndGroup = (e: KonvaEventObject<DragEvent>) => {
    const newPosition = e.target.position();
    setGroupPosition(newPosition);
  };

  return {
    stageRef,
    groupRef,
    imageRef,
    circleRef,
    handleZoom,
    handleFitImage,
    handleDragEndGroup,
  };
};
