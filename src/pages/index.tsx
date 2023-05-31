import { AppShell, Box, Divider } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useCallback, useRef } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import { ContinueModal, PanelResizeHandler, Select } from '@/components/Common';
import { SideAreaOperation } from '@/components/Common/SideAreaOperation';
import { FrameList, FrameOperation } from '@/components/Gallery';
import { AnnotationMarkerEditor } from '@/components/Marker';
import { Player, PlayerEditor } from '@/components/Player';
import { useBlockBrowserNavigation } from '@/hooks';
import { useCanvas, useEditorMode, useFrame, useMarker, useVideo } from '@/store';
import type { ProcessingMode } from '@/types';

const AnnotationCanvas = dynamic(() => import('@/components/Canvas/AnnotationCanvas'), {
  ssr: false,
});

const EditorPage: FC = () => {
  useBlockBrowserNavigation();

  const stageElement = useElementSize();
  const { processingMode, selectProcessingMode } = useEditorMode();
  const { selectedVideo, selectedVideoUrl } = useVideo();
  const { videoFrames, currentFrameIndex, frames, selectedFrame, addFrame, moveFrameIndex } =
    useFrame();
  const { frameMarkers, createFrameMarkers } = useMarker();
  const { canvases, selectedCanvas, addCanvas } = useCanvas();

  const videoRef = useRef<HTMLVideoElement>(null);
  const operationAreaHeight = 80;
  const stageSize = {
    width: stageElement.width,
    height: stageElement.height - operationAreaHeight,
  };

  const handleClickCapture = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || !frames) {
        return;
      }

      const currentFrameNumber = Number(Math.round(video.currentTime / 0.03).toString());
      const existingFrameIndex = frames.findIndex(
        (frame) => frame.name === `${currentFrameNumber}`,
      );

      if (existingFrameIndex !== -1) {
        return;
      }

      const nextFrameIndex = frames.findIndex((frame) => Number(frame.name) > currentFrameNumber);
      addFrame(video, nextFrameIndex);
      addCanvas(video, nextFrameIndex);
      createFrameMarkers(`${selectedVideo?.name}-${currentFrameNumber}`);

      if (nextFrameIndex === -1) {
        moveFrameIndex(frames.length);
      } else {
        moveFrameIndex(nextFrameIndex);
      }

      video.currentTime += 0.03;
    },
    [frames, selectedVideo, addCanvas, addFrame, createFrameMarkers, moveFrameIndex],
  );

  return (
    <AppShell
      padding='md'
      sx={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          padding: 0,
          userSelect: 'none',
        },
      })}
    >
      <PanelGroup direction='horizontal'>
        <Panel defaultSize={20} maxSize={50} className='flex flex-col'>
          <div className='flex-1 space-y-4 p-4'>
            <Select
              width='100%'
              value={processingMode}
              data={[
                { value: 'frameExtraction', label: 'フレーム抽出' },
                { value: 'annotation', label: 'アノテーション' },
              ]}
              onChange={(value) => selectProcessingMode(value as ProcessingMode)}
            />
            {processingMode === 'frameExtraction' ? <PlayerEditor /> : null}
            {processingMode === 'annotation' ? <AnnotationMarkerEditor /> : null}
          </div>
          <Divider className='mx-1' />
          <SideAreaOperation />
        </Panel>

        <PanelResizeHandler className='h-screen w-1' />

        <Panel>
          <Box
            className='flex h-screen flex-col overflow-hidden'
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
            })}
          >
            {/* <Center className='mx-auto h-20'>

            </Center> */}
            <div className='relative flex-1 overflow-hidden' ref={stageElement.ref}>
              {processingMode === 'frameExtraction' && selectedVideoUrl ? (
                <Player
                  videoUrl={selectedVideoUrl}
                  videoRef={videoRef}
                  stageSize={stageSize}
                  onClickCapture={handleClickCapture}
                />
              ) : null}
              {processingMode === 'annotation' && !!selectedFrame && !!selectedCanvas ? (
                <AnnotationCanvas
                  stageSize={stageSize}
                  selectedFrame={selectedFrame}
                  selectedCanvas={canvases[currentFrameIndex]}
                />
              ) : null}
            </div>
            <div className='h-44'>
              {frames && frames.length !== 0 && frames.length === canvases.length ? (
                <>
                  <FrameList frames={frames} canvases={canvases} />
                  <FrameOperation frames={frames} />
                </>
              ) : null}
            </div>
          </Box>
        </Panel>
        <PanelResizeHandler className='h-screen w-1' />

        {/* <Panel defaultSize={20} maxSize={50} className='flex flex-col'></Panel> */}
      </PanelGroup>
      {videoFrames && frameMarkers ? <ContinueModal /> : null}
    </AppShell>
  );
};
export default EditorPage;
