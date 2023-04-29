import { Group, Text } from '@mantine/core';
import type { FC } from 'react';
import { TbArrowLeft, TbArrowRight, TbCurrentLocation, TbTrash } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
  currentFrameIndex: number;
  onMoveFrameIndex: (index: number, isScroll?: boolean) => void;
  onSelectFrameIndex: (index: number, isScroll?: boolean) => void;
  onDeleteFrame: (currentFrameIndex: number) => void;
};

export const FrameOperation: FC<Props> = ({
  frames,
  currentFrameIndex,
  onMoveFrameIndex,
  onSelectFrameIndex,
  onDeleteFrame,
}) => (
  <div className='flex h-12 justify-between px-4 py-2'>
    <Group>
      <IconButton
        icon={TbTrash}
        color='red'
        variant='outline'
        onClick={() => onDeleteFrame(currentFrameIndex)}
      />
      <IconButton
        icon={TbCurrentLocation}
        onClick={() => onSelectFrameIndex(currentFrameIndex, true)}
      />
    </Group>
    <Group>
      <IconButton
        icon={TbArrowLeft}
        onClick={() => onMoveFrameIndex(currentFrameIndex - 1, true)}
      />
      <IconButton
        icon={TbArrowRight}
        onClick={() => onMoveFrameIndex(currentFrameIndex + 1, true)}
      />
    </Group>
    <Text>{`${currentFrameIndex + 1} / ${frames.length}`}</Text>
  </div>
);
