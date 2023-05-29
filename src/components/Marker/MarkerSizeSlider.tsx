import { Slider } from '@mantine/core';
import type { FC } from 'react';

import { Label } from '@/components/Common';
import { useMarkerSetting } from '@/store';

export const MarkerSizeSlider: FC = () => {
  const { radius, updateRadius } = useMarkerSetting();
  return (
    <div>
      <Label label='SIZE' size='xs' />
      <Slider
        mb='lg'
        w='100%'
        color='indigo'
        min={1}
        max={6}
        value={radius}
        onChange={updateRadius}
        marks={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
          { value: 6, label: '6' },
        ]}
      />
    </div>
  );
};
