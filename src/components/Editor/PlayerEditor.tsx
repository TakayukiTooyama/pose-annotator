import { Button, Center, Flex } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  viewMode: string;
  // canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  stageVideoWidth: number;
  stageVideoHeight: number;
  onCaptureVideoFrame: (video: HTMLVideoElement | null) => void;
};

export const PlayerEditor: FC<Props> = ({
  viewMode,
  // canvasRef,
  videoUrl,
  videoRef,
  stageVideoHeight,
  stageVideoWidth,
  onCaptureVideoFrame,
}) => (
  <div className='h-full' style={{ display: viewMode === 'frameExtraction' ? 'block' : 'none' }}>
    <Flex direction='column' h='100%'>
      {/* <canvas ref={canvasRef} className='hidden' /> */}
      <Center className='flex-1'>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          muted
          width={stageVideoWidth}
          height={stageVideoHeight}
          className='absolute'
        />
      </Center>
      <Center h={80}>
        <Button variant='default' onClick={() => onCaptureVideoFrame(videoRef.current)}>
          スクショ
        </Button>
      </Center>
    </Flex>
  </div>
);
