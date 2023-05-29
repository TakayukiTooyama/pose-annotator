import { AlphaSlider } from '@mantine/core';
import type { FC } from 'react';

import { Label } from '@/components/Common';
import { useMarkerSetting } from '@/store';

export const MarkerOpacitySlider: FC = () => {
  const { opacity, updateOpacity } = useMarkerSetting();
  return (
    <div>
      <Label label='OPACITY' size='xs' />
      <AlphaSlider
        color='#536DED'
        value={opacity}
        onChange={updateOpacity}
        onChangeEnd={updateOpacity}
      />
    </div>
  );
};
