import { AppShell, Box } from '@mantine/core';
import { useElementSize, useToggle } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useCallback, useRef } from 'react';

import { ContinueModal } from '@/components/Common';
import { FrameList, FrameOperation } from '@/components/Gallery';
import { Header } from '@/components/Header';
import { MarkerEditor } from '@/components/Marker';
import { Player } from '@/components/Player';
import { Sidebar } from '@/components/Sidebar';
import { useBlockBrowserNavigation, useMultiToggle } from '@/hooks';
import { useCanvas, useFrame, useMarker, useVideo } from '@/store';

const AnnotationCanvas = dynamic(() => import('@/components/Canvas/AnnotationCanvas'), {
  ssr: false,
});

const EditorPage: FC = () => {
  useBlockBrowserNavigation();

  const [viewMode, toggleViewMode] = useToggle(['frameExtraction', 'annotation']);
  const [labelingMode, toggleLabelingMode] = useToggle(['allLabeling', 'oneLabeling']);
  const stageElement = useElementSize();
  const { open, close, isOpen } = useMultiToggle();

  const { videos, selectedVideo, selectedVideoUrl } = useVideo();
  const {
    videoFrames,
    currentFrameIndex,
    frames,
    selectedFrame,
    addFrame,
    moveFrameIndex,
    updateVideoFrames,
  } = useFrame();
  const { frameMarkers, createFrameMarkers, updateFrameMarkers } = useMarker();
  const { canvases, selectedCanvas, addCanvas } = useCanvas();

  const videoRef = useRef<HTMLVideoElement>(null);
  const stageSize = { width: stageElement.width, height: stageElement.height };

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
      header={<Header onOpenSidebar={() => open('sidebar')} />}
      padding='md'
      sx={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: 54,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          userSelect: 'none',
        },
      })}
    >
      <Sidebar
        showDrawer={isOpen('sidebar')}
        onCloseSidebar={() => close('sidebar')}
        toggleViewMode={toggleViewMode}
      />
      <div className='flex h-full flex-col'>
        <div className='flex flex-1'>
          <MarkerEditor
            labelingMode={labelingMode}
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
            toggleLabelingMode={toggleLabelingMode}
          />
          <div className='flex flex-1 flex-col overflow-hidden'>
            <Box
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
                position: 'relative',
                flexGrow: 1,
                overflow: 'hidden',
              })}
              ref={stageElement.ref}
            >
              {viewMode === 'frameExtraction' && selectedVideoUrl ? (
                <Player
                  videoUrl={selectedVideoUrl}
                  videoRef={videoRef}
                  stageSize={stageSize}
                  onClickCapture={handleClickCapture}
                />
              ) : null}
              {viewMode === 'annotation' && !!selectedFrame && !!selectedCanvas ? (
                <AnnotationCanvas
                  labelingMode={labelingMode}
                  stageSize={stageSize}
                  selectedFrame={selectedFrame}
                  selectedCanvas={canvases[currentFrameIndex]}
                />
              ) : null}
            </Box>
            <div className='h-44'>
              {frames && frames.length !== 0 && frames.length === canvases.length ? (
                <>
                  <FrameList frames={frames} canvases={canvases} />
                  <FrameOperation frames={frames} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {videoFrames && frameMarkers ? (
        <ContinueModal
          videos={videos}
          videoFrames={videoFrames}
          frameMarkers={frameMarkers}
          updateVideoFrames={updateVideoFrames}
          updateFrameMarkers={updateFrameMarkers}
        />
      ) : null}
    </AppShell>
  );
};
export default EditorPage;
