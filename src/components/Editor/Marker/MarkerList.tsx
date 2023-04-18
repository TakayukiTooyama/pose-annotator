import { Radio, ScrollArea } from '@mantine/core';
import type { FC } from 'react';

import type { MarkerOption } from '@/types';

type Props = {
  markers: MarkerOption[];
  selectMarkerIndex: number;
  onChangeRadio: (value: string) => void;
};

export const MarkerList: FC<Props> = ({ markers, selectMarkerIndex, onChangeRadio }) => (
  <ScrollArea.Autosize
    style={{
      maxHeight: 'calc(100vh - 230px - 250px)',
    }}
  >
    <Radio.Group
      name='markers'
      value={markers[selectMarkerIndex]?.label}
      onChange={onChangeRadio}
      className='space-y-3'
    >
      {markers.map((marker) => (
        <Radio key={marker.label} value={marker.label} label={marker.label} color='orange' />
      ))}
    </Radio.Group>
  </ScrollArea.Autosize>
);
