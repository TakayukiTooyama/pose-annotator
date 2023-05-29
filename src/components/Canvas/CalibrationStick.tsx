import type { FC } from 'react';
import { Line } from 'react-konva';

import { useMarkerSetting } from '@/store';
import type { Marker, Position, Scale } from '@/types';

type Props = {
  markers: Marker[];
  positionScale: Scale;
};

export const CalibrationStick: FC<Props> = ({ markers, positionScale }) => {
  const { radius, opacity } = useMarkerSetting();

  const marker: { [key: string]: Position } = markers.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.label]: { x: cur.position?.x, y: cur.position?.y },
    }),
    {},
  );

  const stickPoints = [
    [marker['左上']?.x, marker['左上']?.y, marker['右上']?.x, marker['右上']?.y],
    [marker['左上']?.x, marker['左上']?.y, marker['左下']?.x, marker['左下']?.y],
    [marker['左下']?.x, marker['左下']?.y, marker['右下']?.x, marker['右下']?.y],
    [marker['右上']?.x, marker['右上']?.y, marker['右下']?.x, marker['右下']?.y],
  ];
  return (
    <>
      {stickPoints.map((points: (number | undefined)[], idx) => {
        if (!points[0] || !points[1] || !points[2] || !points[3]) {
          return;
        }
        return (
          <Line
            key={idx}
            points={[
              points[0] / positionScale.x,
              points[1] / positionScale.y,
              points[2] / positionScale.x,
              points[3] / positionScale.y,
            ]}
            stroke='white'
            strokeWidth={radius - 0.5}
            opacity={opacity}
          />
        );
      })}
    </>
  );
};
