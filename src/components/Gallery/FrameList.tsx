import { Flex, ScrollArea } from '@mantine/core';
import Image from 'next/image';
import type { FC } from 'react';

import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
  frameUrl: string[];
  onSelectFrame: (index: number) => void;
  viewport: React.RefObject<HTMLDivElement>;
  currentFrameIndex: number;
};

export const FrameList: FC<Props> = ({
  frames,
  frameUrl,
  onSelectFrame,
  viewport,
  currentFrameIndex,
}) => (
  <>
    <ScrollArea className='h-32 w-full' viewportRef={viewport}>
      <Flex>
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            onClick={() => onSelectFrame(index)}
            className='relative cursor-pointer'
            style={{
              width: 128 / (9 / 16),
              height: 128,
            }}
          >
            <div
              className='absolute left-0 top-0 z-10 h-full w-full'
              style={{
                border: index === currentFrameIndex ? '3px solid red' : '',
              }}
            />
            <Image src={frameUrl[index]} alt='screenshot' fill style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </Flex>
    </ScrollArea>
  </>
);
