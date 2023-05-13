import { Button, Center } from '@mantine/core';
import type { FC } from 'react';

import { useVideoSize } from '@/hooks';
import type { Dimensions } from '@/types';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  stageSize: Dimensions;
  onClickCapture: (video: HTMLVideoElement | null) => void;
};

export const Player: FC<Props> = ({ videoUrl, videoRef, stageSize, onClickCapture }) => {
  const { videoSize } = useVideoSize(videoRef, stageSize);

  return (
    <div className='flex h-full flex-col'>
      <Center className='flex-1'>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          muted
          width={videoSize.width}
          height={videoSize.height}
          className='absolute'
          style={{ display: videoSize.width === 0 ? 'none' : 'block' }}
        />
      </Center>
      <Center h={80}>
        <Button variant='default' onClick={() => onClickCapture(videoRef.current)}>
          スクショ
        </Button>
      </Center>
    </div>
  );
};
