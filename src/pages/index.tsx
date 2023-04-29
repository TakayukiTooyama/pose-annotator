import { AppShell, Modal, Progress } from '@mantine/core';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useCallback } from 'react';

import { ContinueModal } from '@/components/Common';
import { FrameInfo, FrameOperation } from '@/components/Gallery';
import { FrameList2 } from '@/components/Gallery/FrameList2';
import { Header } from '@/components/Header';
import { SidebarDrawer } from '@/components/Sidebar';
import { useDownloadCSV } from '@/hooks/useDownloadCSV';
import { useFrameMarkers } from '@/hooks/useFrameMarkers';
import { useModal } from '@/hooks/useModal';
import { useVideoFrames } from '@/hooks/useVideoFrames';
import { useVideos } from '@/hooks/useVideos';

const Editor = dynamic(() => import('@/components/Editor/Editor'), {
  ssr: false,
});

const EditorPage: FC = () => {
  const { openModal, closeModal, isModalOpen } = useModal();

  const { videos, selectedVideoUrl, currentVideoIndex, handleAddVideo, handleSelectedVideo } =
    useVideos();

  const {
    viewportRef,
    videoRef,
    frames,
    canvases,
    videoFrames,
    currentFrameIndex,
    removeVideoFrames,
    handleAddVideoFrames,
    handleDeleteVideoFrames,
    handleSelectFrameIndex,
    handleMoveFrameIndex,
  } = useVideoFrames(videos[currentVideoIndex]);

  const { frameMarkers, removeFrameMarkers } = useFrameMarkers(frames[currentFrameIndex]);

  const { progress, isDownload, handleClickDownloadDataUrls } = useDownloadCSV(
    videos,
    videoFrames,
    frameMarkers,
    'TakayukiTooyama',
  );

  const handleDeleteLocalStorage = useCallback(() => {
    removeVideoFrames();
    removeFrameMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell
      header={
        <Header
          onClick={() => openModal('sidebar')}
          frames={frames}
          onClickDownloadDataUrls={handleClickDownloadDataUrls}
        />
      }
      padding='md'
      sx={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: 54,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        },
      })}
    >
      <SidebarDrawer
        showDrawer={isModalOpen('sidebar')}
        videoRef={videoRef}
        videos={videos}
        currentVideoIndex={currentVideoIndex}
        onClose={() => closeModal('sidebar')}
        onSelectVideo={handleSelectedVideo}
        onAddVideo={handleAddVideo}
      />
      <div className='flex h-full flex-col'>
        <Editor
          videoRef={videoRef}
          videoUrl={selectedVideoUrl}
          videos={videos}
          currentVideoIndex={currentVideoIndex}
          canvas={canvases[currentFrameIndex]}
          frames={frames}
          currentFrameIndex={currentFrameIndex}
          handleMoveFrameIndex={handleMoveFrameIndex}
          handleAddVideoFrames={handleAddVideoFrames}
        />

        <div className='flex h-44'>
          {frames.length !== 0 && canvases.length !== 0 ? (
            <>
              <FrameInfo selectFrame={frames[currentFrameIndex]} />
              <div className='flex-1 overflow-hidden'>
                <FrameList2
                  viewportRef={viewportRef}
                  currentFrameIndex={currentFrameIndex}
                  canvases={canvases}
                  onSelectFrame={handleSelectFrameIndex}
                />
                <FrameOperation
                  frames={frames}
                  currentFrameIndex={currentFrameIndex}
                  onMoveFrameIndex={handleMoveFrameIndex}
                  onSelectFrameIndex={handleSelectFrameIndex}
                  onDeleteFrame={handleDeleteVideoFrames}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
      {(videos.length === 0 && videoFrames) || (isModalOpen('continue') && videoFrames) ? (
        <ContinueModal
          videos={videos}
          videoFrames={videoFrames}
          showModal={isModalOpen('continue')}
          onAddVideo={handleAddVideo}
          onDeleteVideoFrames={handleDeleteLocalStorage}
        />
      ) : null}
      {isDownload ? (
        <Modal opened={isDownload} onClose={() => closeModal('download')} withCloseButton={false}>
          <Progress value={progress} animate />
        </Modal>
      ) : null}
    </AppShell>
  );
};
export default EditorPage;
