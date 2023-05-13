import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { FC, MutableRefObject } from 'react';
import { Circle } from 'react-konva';

import { useDarkMode } from '@/hooks';
import type { Marker, MarkerSetting, Position, Scale } from '@/types';
import { brightenColorForDarkMode, getFillColor } from '@/utils';

type Props = {
  markers: Marker[];
  markerSetting: MarkerSetting;
  circleRef: MutableRefObject<Konva.Circle | null>;
  positionScale: Scale;
  onHoverCursor: (e: KonvaEventObject<MouseEvent>) => void;
  onRightClick: (e: KonvaEventObject<MouseEvent>, selectedMarker: Marker) => void;
  onDoubleTapCircle: (e: KonvaEventObject<Event>, selectedMarker: Marker) => void;
  onDragStart: (e: KonvaEventObject<DragEvent>, selectedMarker: Marker) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>, selectedMarker: Marker, scale: Position) => void;
};

export const Markers: FC<Props> = ({
  markers,
  markerSetting,
  circleRef,
  positionScale,
  onRightClick,
  onDoubleTapCircle,
  onHoverCursor,
  onDragStart,
  onDragEnd,
}) => {
  const { colorScheme } = useDarkMode();

  return (
    <>
      {markers.map((marker) => {
        const { position, label } = marker;
        if (!position?.x || !position.y) {
          return null;
        }

        const fillColor = getFillColor(label, markerSetting.options);
        const adjustedFillColor =
          colorScheme === 'dark' ? brightenColorForDarkMode(fillColor) : fillColor;

        return (
          <Circle
            key={label}
            ref={circleRef}
            x={position.x / positionScale.x}
            y={position.y / positionScale.y}
            radius={markerSetting.radius - 0.5} // 最小が1だと大きすぎるため
            fill={adjustedFillColor}
            opacity={markerSetting.opacity}
            draggable
            onMouseEnter={onHoverCursor}
            onMouseLeave={onHoverCursor}
            onContextMenu={(e) => onRightClick(e, marker)}
            onDblTap={(e) => onDoubleTapCircle(e, marker)}
            onDragStart={(e) => onDragStart(e, marker)}
            onDragEnd={(e) => onDragEnd(e, marker, positionScale)}
          />
        );
      })}
    </>
  );
};
