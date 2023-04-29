/* eslint-disable import/no-default-export */

import { Center, Flex } from '@mantine/core';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { FC } from 'react';
import { useRef, useState } from 'react';

import { CanvasOperation } from '@/components/Editor/Canvas/CanvasOperation';
import CanvasStage from '@/components/Editor/Canvas/CanvasStage';
import type { Frame, Marker, Position } from '@/types';

type Props = {
  markers: Marker[];
  currentMarkerIndex: number;
  frame: Frame;
  canvas: HTMLCanvasElement;
  stageWidth: number;
  stageHeight: number;
  handleLabeling: (
    e: KonvaEventObject<MouseEvent>,
    scale: { x: number; y: number },
    selectMarker: Marker,
  ) => void;
  handleUpdateMarkers: (marker: Marker[]) => void;
};

export const CanvasEditor: FC<Props> = ({
  markers,
  currentMarkerIndex,
  frame,
  canvas,
  stageWidth,
  stageHeight,
  handleLabeling,
  handleUpdateMarkers,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  const circleRef = useRef<Konva.Circle>(null);

  //切り抜いたフレームサイズ
  const frameWidth = frame.dimensions.width;
  const frameHeight = frame.dimensions.height;
  const frameAspectRatio = frameWidth / frameHeight;
  const isTall = stageWidth / frameAspectRatio > stageHeight;
  // ステージに収めたフレームサイズ
  const stageFrameWidth = isTall ? stageHeight * frameAspectRatio : stageWidth;
  const stageFrameHeight = isTall ? stageHeight : stageWidth / frameAspectRatio;
  // ステージの座標を元画像の座標に変換するためのスケール
  const positionXScale = frameWidth / stageWidth;
  const positionYScale = frameHeight / (stageWidth / frameAspectRatio);

  const [isDraggable, setIsDraggable] = useState(true);
  const [mouseDownTime, setMouseDownTime] = useState(0);
  const [, setGroupPosition] = useState({ x: 0, y: 0 });

  // キャンバス上の処理
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

  const handleMouseDownImage = () => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUpImage = (e: KonvaEventObject<MouseEvent>) => {
    const timeDiff = Date.now() - mouseDownTime;
    if (timeDiff < 250) {
      handleLabeling(
        e,
        {
          x: positionXScale,
          y: positionYScale,
        },
        markers[currentMarkerIndex],
      );
    }
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
    // setSelectMarker(Marker);
  };

  const handleDragEndCircle = (e: KonvaEventObject<DragEvent>, selectMarker: Marker) => {
    setIsDraggable(true);
    const newPosition: Position = {
      x: Math.round(e.target.x() * positionXScale),
      y: Math.round(e.target.y() * positionYScale),
    };
    const newMarkers: Marker[] = markers.map((marker) => ({
      ...marker,
      position: marker.label === selectMarker.label ? newPosition : marker.position,
    }));
    handleUpdateMarkers(newMarkers);
  };

  //　キャンバス外の処理
  const handleFitImage = () => {
    stageRef.current?.scale({ x: 1, y: 1 });
    groupRef.current?.position({ x: stageWidth / 2, y: stageHeight / 2 });
    stageRef.current?.position({ x: -stageFrameWidth / 2, y: -stageFrameHeight / 2 });
  };

  const handleDragEndGroup = (e: KonvaEventObject<DragEvent>) => {
    const newPosition = e.target.position();
    setGroupPosition(newPosition);
  };

  return (
    <Flex direction='column' h='100%'>
      <Center className='flex-1'>
        <CanvasStage
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          markers={markers}
          image={canvas as any}
          isDraggable={isDraggable}
          stageRef={stageRef}
          groupRef={groupRef}
          imageRef={imageRef}
          circleRef={circleRef}
          stageFrameWidth={stageFrameWidth}
          stageFrameHeight={stageFrameHeight}
          positionXScale={positionXScale}
          positionYScale={positionYScale}
          onZoom={handleZoom}
          onMouseDownImage={handleMouseDownImage}
          onMouseUpImage={handleMouseUpImage}
          onHoverCursorCircle={handleHoverCircle}
          onDragStartCircle={handleDragStartCircle}
          onDragEndCircle={handleDragEndCircle}
          onDragEndGroup={handleDragEndGroup}
        />
      </Center>
      <Center h={80}>
        <CanvasOperation onFitImage={handleFitImage} />
      </Center>
    </Flex>
  );
};
