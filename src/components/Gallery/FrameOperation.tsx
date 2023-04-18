import { Group, Text } from '@mantine/core';
import type { FC } from 'react';
import { TbArrowLeft, TbArrowRight, TbCurrentLocation, TbTrash } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
  selectFrameIndex: number;
  onSelectFrame: (index: number) => void;
  onScrollToSelectFrame: () => void;
  onDeleteFrame: () => void;
};

export const FrameOperation: FC<Props> = ({
  frames,
  selectFrameIndex,
  onSelectFrame,
  onScrollToSelectFrame,
  onDeleteFrame,
}) => (
  <div className='flex h-12 justify-between px-4 py-2'>
    <Group>
      <IconButton icon={TbTrash} color='red' variant='outline' onClick={onDeleteFrame} />
      <IconButton icon={TbCurrentLocation} onClick={onScrollToSelectFrame} />
    </Group>
    <Group>
      <IconButton icon={TbArrowLeft} onClick={() => onSelectFrame(selectFrameIndex - 1)} />
      <IconButton icon={TbArrowRight} onClick={() => onSelectFrame(selectFrameIndex + 1)} />
    </Group>
    <Text>{`${selectFrameIndex + 1} / ${frames.length}`}</Text>
  </div>
);
