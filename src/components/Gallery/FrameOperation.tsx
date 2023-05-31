import { Group } from '@mantine/core';
import type { FC } from 'react';
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbTrash,
} from 'react-icons/tb';

import { IconButton, Text } from '@/components/Common';
import { FrameCounter } from '@/components/Gallery';
import { useFrame } from '@/store';
import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
};

export const FrameOperation: FC<Props> = ({ frames }) => {
  const { currentFrameIndex, moveFrameIndex, deleteFrame } = useFrame();

  return (
    <div className='flex h-12 items-center justify-between px-4 py-2'>
      <div className='w-[34px] opacity-0' />
      <Group className='flex items-center'>
        <div className='flex space-x-1'>
          <IconButton
            icon={TbChevronsLeft}
            onClick={() => moveFrameIndex(0)}
            disabled={currentFrameIndex === 0}
          />
          <IconButton
            icon={TbChevronLeft}
            onClick={() => moveFrameIndex(currentFrameIndex - 1)}
            disabled={currentFrameIndex === 0}
          />
        </div>
        <div className='flex items-center'>
          <FrameCounter />
          <Text text='/' />
          <Text text={`${frames.length - 1}`} className='w-10 text-center' />
        </div>
        <div className='flex space-x-1'>
          <IconButton
            icon={TbChevronRight}
            onClick={() => moveFrameIndex(currentFrameIndex + 1)}
            disabled={frames.length === currentFrameIndex + 1}
          />
          <IconButton
            icon={TbChevronsRight}
            onClick={() => moveFrameIndex(frames.length - 1)}
            disabled={frames.length === currentFrameIndex + 1}
          />
        </div>
      </Group>
      <IconButton
        icon={TbTrash}
        color='red'
        variant='outline'
        onClick={() => deleteFrame(currentFrameIndex)}
      />
    </div>
  );
};
