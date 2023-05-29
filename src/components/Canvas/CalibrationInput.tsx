import { Group, rem, TextInput } from '@mantine/core';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';

import { Label } from '@/components/Common';
import { useCalibrationMarker } from '@/store';

export const CalibrationInput: FC = () => {
  const { updateRealDimensions, realDimensions } = useCalibrationMarker();
  const [actualWidth, setActualWidth] = useState<number | ''>(realDimensions.width);
  const [actualHeight, setActualHeight] = useState<number | ''>(realDimensions.height);

  const handleChangeDimension = (
    e: React.FormEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<number | ''>>,
  ) => {
    const inputFrameIndex = e.currentTarget.value;
    if (inputFrameIndex === '' || /^[\d]*$/.test(inputFrameIndex)) {
      setState(Number(inputFrameIndex));
    }
  };

  const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateRealDimensions({ width: actualWidth, height: actualHeight });
    }
  };

  const handleBlur = () => {
    updateRealDimensions({ width: actualWidth, height: actualHeight });
  };

  return (
    <Group>
      <div className='flex items-center'>
        <Label label='横：' />
        <TextInput
          value={actualWidth}
          onChange={(e) => handleChangeDimension(e, setActualWidth)}
          onKeyDown={handleKeyDownEnter}
          onBlur={handleBlur}
          styles={{
            input: {
              marginRight: rem(8),
              width: rem(52),
              textAlign: 'center',
            },
          }}
        />
        <Label label='m' />
      </div>
      <div className='flex items-center'>
        <Label label='縦：' />
        <TextInput
          value={actualHeight}
          onChange={(e) => handleChangeDimension(e, setActualHeight)}
          onKeyDown={handleKeyDownEnter}
          onBlur={handleBlur}
          styles={{
            input: {
              marginRight: rem(8),
              width: rem(52),
              textAlign: 'center',
            },
          }}
        />
        <Label label='m' />
      </div>
    </Group>
  );
};
