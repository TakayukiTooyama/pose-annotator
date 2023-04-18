import { Center, Flex } from '@mantine/core';
import type { Dispatch, FC, SetStateAction } from 'react';

import { PlayerOperation, PlayerView } from '@/components/Editor/Player/';
import type { Frame, Video } from '@/types';

type Props = {
  viewMode: string;
  videoUrl: string;
  frames: Frame[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  stageVideoWidth: number;
  stageVideoHeight: number;
  videos: Video[];
  selectVideoIndex: number;
  setFrames: Dispatch<SetStateAction<Frame[]>>;
  setFrameUrl: Dispatch<SetStateAction<string[]>>;
};

export const PlayerEditor: FC<Props> = ({
  viewMode,
  canvasRef,
  videoUrl,
  frames,
  videoRef,
  stageVideoHeight,
  stageVideoWidth,
  videos,
  selectVideoIndex,
  setFrames,
  setFrameUrl,
}) => (
  <div className='h-full' style={{ display: viewMode === 'frameExtraction' ? 'block' : 'none' }}>
    <Flex direction='column' h='100%'>
      <canvas ref={canvasRef} className='hidden' />
      <Center className='flex-1'>
        <PlayerView
          url={videoUrl}
          videoRef={videoRef}
          width={stageVideoWidth}
          height={stageVideoHeight}
        />
      </Center>
      <Center h={80}>
        <PlayerOperation
          videoRef={videoRef}
          canvasRef={canvasRef}
          frames={frames}
          selectVideoIndex={selectVideoIndex}
          videos={videos}
          setFrames={setFrames}
          setFrameUrl={setFrameUrl}
        />
      </Center>
    </Flex>
  </div>
);
