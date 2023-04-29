import { Radio, ScrollArea } from '@mantine/core';
import type { FC } from 'react';

import type { MarkerOption } from '@/types';

type Props = {
  markerOptions: MarkerOption[];
  currentMarkerIndex: number;
  onChangeRadio: (value: string) => void;
};

export const MarkerList: FC<Props> = ({ markerOptions, currentMarkerIndex, onChangeRadio }) => (
  <ScrollArea.Autosize
    style={{
      maxHeight: 'calc(100vh - 230px - 250px)',
    }}
  >
    <Radio.Group
      name='markerOptions'
      value={markerOptions[currentMarkerIndex]?.label}
      onChange={onChangeRadio}
      className='space-y-3'
    >
      {markerOptions.map((marker) => (
        <Radio key={marker.label} value={marker.label} label={marker.label} color='orange' />
      ))}
    </Radio.Group>
  </ScrollArea.Autosize>
);
