import { Text } from '@mantine/core';
import type { FC } from 'react';

import type { Frame } from '@/types';
import { formatBytes } from '@/utils';

type Props = {
  selectFrame: Frame | null;
};

export const FrameInfo: FC<Props> = ({ selectFrame }) => (
  <div className='w-32 shrink-0 p-4'>
    {selectFrame ? (
      <>
        <Text>{`${selectFrame.name} Frame`}</Text>
        <Text>{`${selectFrame.dimensions.width} x ${selectFrame.dimensions.height}`}</Text>
        <Text>{formatBytes(selectFrame.size)}</Text>
      </>
    ) : null}
  </div>
);
