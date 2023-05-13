/* eslint-disable import/no-default-export */
import type { FC } from 'react';
import { Line } from 'react-konva';

import { useMarkerSetting } from '@/store';
import type { Marker, Position, Scale } from '@/types';

type Props = {
  markers: Marker[];
  positionScale: Scale;
};

export const StickPicture: FC<Props> = ({ positionScale, markers }) => {
  const { radius, opacity } = useMarkerSetting();

  /* 全18本で構成されたスティックピクチャーの始点と終点 */
  const marker: { [key: string]: Position } = markers.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.label]: { x: cur.position?.x, y: cur.position?.y },
    }),
    {},
  );

  const stickPoints = [
    /* 右腕 */
    [marker['RShoulder']?.x, marker['RShoulder']?.y, marker['RElbow']?.x, marker['RElbow']?.y],
    [marker['RElbow']?.x, marker['RElbow']?.y, marker['RWrist']?.x, marker['RWrist']?.y],
    [marker['RWrist']?.x, marker['RWrist']?.y, marker['RIndex']?.x, marker['RIndex']?.y],

    /* 左腕 */
    [marker['LShoulder']?.x, marker['LShoulder']?.y, marker['LElbow']?.x, marker['LElbow']?.y],
    [marker['LElbow']?.x, marker['LElbow']?.y, marker['LWrist']?.x, marker['LWrist']?.y],
    [marker['LWrist']?.x, marker['LWrist']?.y, marker['LIndex']?.x, marker['LIndex']?.y],
    /* 体幹 */
    [marker['RShoulder']?.x, marker['RShoulder']?.y, marker['RHip']?.x, marker['RHip']?.y],
    [
      marker['RShoulder']?.x,
      marker['RShoulder']?.y,
      marker['LShoulder']?.x,
      marker['LShoulder']?.y,
    ],
    [marker['LShoulder']?.x, marker['LShoulder']?.y, marker['LHip']?.x, marker['LHip']?.y],
    [marker['RHip']?.x, marker['RHip']?.y, marker['LHip']?.x, marker['LHip']?.y],

    /* 右脚 */
    [marker['RHip']?.x, marker['RHip']?.y, marker['RKnee']?.x, marker['RKnee']?.y],
    [marker['RKnee']?.x, marker['RKnee']?.y, marker['RAnkle']?.x, marker['RAnkle']?.y],
    [marker['RAnkle']?.x, marker['RAnkle']?.y, marker['RHeel']?.x, marker['RHeel']?.y],
    [marker['RAnkle']?.x, marker['RAnkle']?.y, marker['RFootIndex']?.x, marker['RFootIndex']?.y],

    /* 左脚 */
    [marker['LHip']?.x, marker['LHip']?.y, marker['LKnee']?.x, marker['LKnee']?.y],
    [marker['LKnee']?.x, marker['LKnee']?.y, marker['LAnkle']?.x, marker['LAnkle']?.y],
    [marker['LAnkle']?.x, marker['LAnkle']?.y, marker['LHeel']?.x, marker['LHeel']?.y],
    [marker['LAnkle']?.x, marker['LAnkle']?.y, marker['LFootIndex']?.x, marker['LFootIndex']?.y],
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
