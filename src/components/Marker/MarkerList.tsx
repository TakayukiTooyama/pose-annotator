import { Radio } from '@mantine/core';
import type { FC } from 'react';

import type { MarkerOption } from '@/types';
import { brightenColorForDarkMode } from '@/utils';

type Props = {
  markerOptions: MarkerOption[];
  currentMarkerIndex: number;
  labeledList: string[];
  moveMarkerIndex: (index: number) => void;
};

export const MarkerList: FC<Props> = ({
  markerOptions,
  currentMarkerIndex,
  labeledList,
  moveMarkerIndex,
}) => {
  const handleChangeRadio = (value: string) => {
    const selectedMarkerIndex = markerOptions.findIndex((marker) => marker.label === value);
    moveMarkerIndex(selectedMarkerIndex);
  };

  return (
    <Radio.Group
      name='markerOptions'
      value={markerOptions[currentMarkerIndex]?.label}
      onChange={handleChangeRadio}
      className='space-y-3'
    >
      {markerOptions.map((marker) => (
        <Radio
          key={marker.label}
          value={marker.label}
          label={marker.label}
          color='indigo'
          sx={(theme) => ({
            label: {
              opacity: labeledList.includes(marker.label) ? 0.3 : 1,
              color:
                theme.colorScheme === 'dark'
                  ? brightenColorForDarkMode(marker.color)
                  : marker.color,
              fontWeight: 'bold',
            },
          })}
        />
      ))}
    </Radio.Group>
  );
};
