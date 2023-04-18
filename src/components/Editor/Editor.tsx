/* eslint-disable import/no-default-export */
import { Flex } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import type { Dispatch, FC, SetStateAction } from 'react';

import { CanvasEditor } from '@/components/Editor/Canvas';
import { PlayerEditor } from '@/components/Editor/Player';
import type { Frame, Video } from '@/types';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoUrl: string;
  frameUrl: string[];
  viewMode: string;
  labelingMode: string;
  videos: Video[];
  frames: Frame[];
  selectFrameIndex: number;
  selectVideoIndex: number;
  selectMarkerIndex: number;
  setFrames: Dispatch<SetStateAction<Frame[]>>;
  setFrameUrl: Dispatch<SetStateAction<string[]>>;
  setSelectFrameIndex: Dispatch<SetStateAction<number>>;
  setSelectMarkerIndex: (index: number) => void;
};

const Editor: FC<Props> = ({
  videoRef,
  canvasRef,
  videoUrl,
  frameUrl,
  viewMode,
  labelingMode,
  videos,
  frames,
  selectVideoIndex,
  selectFrameIndex,
  selectMarkerIndex,
  setFrames,
  setFrameUrl,
  setSelectFrameIndex,
  setSelectMarkerIndex,
}) => {
  /* Common */
  const { ref, width: stageWidth, height: stageHeight } = useElementSize();

  // const [markers, setMarkers] = useState<Marker[]>([]);

  const videoWidth = videoRef.current?.videoWidth;
  const videoHeight = videoRef.current?.videoHeight;
  const videoAspectRatio = (videoWidth || 16) / (videoHeight || 0);
  const isTall = stageWidth / videoAspectRatio > stageHeight - 80;
  const stageVideoWidth = isTall ? (stageHeight - 80) * videoAspectRatio : stageWidth;
  const stageVideoHeight = isTall ? stageHeight - 80 : stageWidth / videoAspectRatio;

  return (
    <Flex direction='column' className='flex-1'>
      <div className='relative flex-1 overflow-hidden bg-black' ref={ref}>
        {videoUrl && (
          <PlayerEditor
            viewMode={viewMode}
            videoUrl={videoUrl}
            videos={videos}
            selectVideoIndex={selectVideoIndex}
            frames={frames}
            canvasRef={canvasRef}
            videoRef={videoRef}
            stageVideoHeight={stageVideoHeight}
            stageVideoWidth={stageVideoWidth}
            setFrames={setFrames}
            setFrameUrl={setFrameUrl}
          />
        )}
        {viewMode === 'annotation' && frames.length > 0 && frames[selectFrameIndex] ? (
          <CanvasEditor
            frames={frames}
            frameUrl={frameUrl}
            labelingMode={labelingMode}
            stageWidth={stageWidth}
            stageHeight={stageHeight - 80}
            selectMarkerIndex={selectMarkerIndex}
            setSelectMarkerIndex={setSelectMarkerIndex}
            selectFrameIndex={selectFrameIndex}
            setSelectFrameIndex={setSelectFrameIndex}
            setFrames={setFrames}
          />
        ) : null}
      </div>
    </Flex>
  );
};

export default Editor;
