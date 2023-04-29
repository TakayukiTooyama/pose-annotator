/* eslint-disable import/no-default-export */

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Image as KonvaImage } from 'konva/lib/shapes/Image';
import dynamic from 'next/dynamic';
import type { FC, MutableRefObject, RefObject } from 'react';
import { Circle, Group, Image, Layer, Stage } from 'react-konva';

import { useMarkerSetting } from '@/hooks/useMarkerSetting';
import type { Marker } from '@/types';
import { getFillColor } from '@/utils';

const StickPicture = dynamic(() => import('@/components/Editor/Canvas/StickPicture'), {
  ssr: false,
});

type Props = {
  stageWidth: number;
  stageHeight: number;
  markers: Marker[];
  image: HTMLImageElement | undefined;
  isDraggable: boolean;
  stageRef: MutableRefObject<Konva.Stage | null>;
  groupRef: MutableRefObject<Konva.Group | null>;
  imageRef: RefObject<KonvaImage>;
  circleRef: MutableRefObject<Konva.Circle | null>;
  stageFrameWidth: number;
  stageFrameHeight: number;
  positionXScale: number;
  positionYScale: number;
  onZoom: (e: KonvaEventObject<WheelEvent>) => void;
  onMouseDownImage: () => void;
  onMouseUpImage: (e: KonvaEventObject<MouseEvent>) => void;
  onHoverCursorCircle: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStartCircle: (e: KonvaEventObject<DragEvent>, selectMarker: Marker) => void;
  onDragEndCircle: (e: KonvaEventObject<DragEvent>, selectMarker: Marker) => void;
  onDragEndGroup: (e: KonvaEventObject<DragEvent>) => void;
};

const CanvasStage: FC<Props> = ({
  stageWidth,
  stageHeight,
  markers,
  image,
  isDraggable,
  stageRef,
  groupRef,
  imageRef,
  circleRef,
  stageFrameWidth,
  stageFrameHeight,
  positionXScale,
  positionYScale,
  onZoom,
  onMouseDownImage,
  onMouseUpImage,
  onHoverCursorCircle,
  onDragStartCircle,
  onDragEndCircle,
  onDragEndGroup,
}) => {
  const { markerSetting } = useMarkerSetting();

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={1.0}
      scaleY={1.0}
      ref={stageRef}
      className='absolute'
      x={stageWidth / 2}
      y={stageHeight / 2}
    >
      <Layer key='background'>
        <Group
          ref={groupRef}
          draggable={isDraggable}
          onWheel={onZoom}
          x={-stageFrameWidth / 2}
          y={-stageFrameHeight / 2}
          onDragEnd={onDragEndGroup}
        >
          <Image
            ref={imageRef}
            width={stageFrameWidth}
            height={stageFrameHeight}
            image={image}
            onMouseUp={onMouseUpImage}
            onMouseDown={onMouseDownImage}
            alt=''
          />
          {markers.length > 0 ? (
            <>
              <StickPicture
                markers={markers}
                positionXScale={positionXScale}
                positionYScale={positionYScale}
              />
              {markers.map((marker) => {
                if (!marker.position?.x || !marker.position.y) {
                  return;
                }

                return (
                  <Circle
                    key={marker.label}
                    ref={circleRef}
                    x={marker.position.x / positionXScale}
                    y={marker.position.y / positionYScale}
                    radius={markerSetting.radius}
                    fill={getFillColor(marker.label, markerSetting.options)}
                    opacity={markerSetting.opacity}
                    draggable
                    onMouseEnter={onHoverCursorCircle}
                    onMouseLeave={onHoverCursorCircle}
                    onDragStart={(e) => onDragStartCircle(e, marker)}
                    onDragEnd={(e) => onDragEndCircle(e, marker)}
                  />
                );
              })}
            </>
          ) : null}
        </Group>
      </Layer>
    </Stage>
  );
};

export default CanvasStage;
