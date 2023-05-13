/* eslint-disable import/no-default-export */

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { FC, MutableRefObject } from 'react';
import { Group, Layer } from 'react-konva';

import type { Dimensions, Marker } from '@/types';

type Props = {
  children: React.ReactNode;
  markers: Marker[];
  isDraggable: boolean;
  groupRef: MutableRefObject<Konva.Group | null>;
  frameSize: Dimensions;
  onZoom: (e: KonvaEventObject<WheelEvent>) => void;
  onDragEndGroup: (e: KonvaEventObject<DragEvent>) => void;
};

export const GroupLayer: FC<Props> = ({
  children,
  isDraggable,
  groupRef,
  frameSize,
  onZoom,
  onDragEndGroup,
}) => (
  <Layer key='background'>
    <Group
      ref={groupRef}
      draggable={isDraggable}
      x={-frameSize.width / 2}
      y={-frameSize.height / 2}
      onWheel={onZoom}
      onDragEnd={onDragEndGroup}
    >
      {children}
    </Group>
  </Layer>
);
