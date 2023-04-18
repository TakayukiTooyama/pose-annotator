import { AppShell, Modal, Progress, Skeleton } from '@mantine/core';
import { useDisclosure, useLocalStorage, useToggle } from '@mantine/hooks';
import JSZip from 'jszip';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import * as R from 'remeda';
import { v4 as uuid } from 'uuid';

import { ContinueModal } from '@/components/Common';
import { MarkerEditor } from '@/components/Editor/Marker';
import { FrameInfo, FrameList, FrameOperation } from '@/components/Gallery';
import { Header } from '@/components/Header';
import { SidebarDrawer } from '@/components/Sidebar';
import { usePersistedMarkerStore } from '@/store';
import type { Frame, Video, VideoFrames } from '@/types';
import { createVideoElement, csvFormat, getFrameUrl, removeExtension, zeroPad } from '@/utils';

const Editor = dynamic(() => import('@/components/Editor/Editor'), {
  ssr: false,
});

const EditorPage: FC = () => {
  // hooks
  const [showSidebar, showSidebarHandler] = useDisclosure(false);
  const [showProgressModal, showProgressModalHandler] = useDisclosure(false);
  const [showDeleteModal] = useDisclosure(true);
  const [viewMode, toggleViewMode] = useToggle(['frameExtraction', 'annotation']);
  const [labelingMode, toggleLabelingMode] = useToggle(['allLabeling', 'oneLabeling']);

  // store
  const { selectMarkerIndex, setSelectMarkerIndex } = usePersistedMarkerStore();

  const [videoFrames, setVideoFrames, removeVideoFrames] = useLocalStorage<VideoFrames>({
    key: 'videoFrames',
    defaultValue: {},
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [isCreatingFrameUrls, setIsCreatingFrameUrls] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectVideoIndex, setSelectVideoIndex] = useState(0);
  const [selectFrameIndex, setSelectFrameIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  // Sidebar
  const handleToggle = (handler: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  }) => {
    handler.toggle();
  };

  // VideoFrames
  const handleDeleteVideoFrames = () => {
    removeVideoFrames();
    showSidebarHandler.close();
  };

  const updateVideoFrames = () => {
    if (videos.length === 0) {
      return;
    }
    setVideoFrames((prev) => {
      const newVideoFrames = { ...prev };
      newVideoFrames[videos[selectVideoIndex].name] = frames;
      return newVideoFrames;
    });
  };

  //Video
  const handleAddVideo = (payload: File[]) => {
    if (!videoUrl) {
      setVideoUrl(URL.createObjectURL(payload[0]));
      const x = payload.find((file) => videoFrames[file.name]);
      if (x) {
        setFrames(videoFrames[x.name]);
      }
    }
    const newVideos: Video[] = payload.map((file) => ({
      id: uuid(),
      name: file.name,
      file,
    }));
    setVideos((prev) => R.uniqBy([...prev, ...newVideos], (video) => video.name));
  };

  const handleSelectVideo = async (index: number, video: HTMLVideoElement | null) => {
    if (videos.length - 1 < index || !video) {
      return;
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const selectVideoFrames = videoFrames[videos[index].name] || [];
    updateVideoFrames();
    const newVideoUrl = URL.createObjectURL(videos[index].file);
    setVideoUrl(newVideoUrl);
    setSelectVideoIndex(index);
    setFrames(selectVideoFrames || []);
  };

  // Frame
  const handleSelectFrame = (index: number) => {
    if (index < 0 || index === frames.length) {
      return;
    }
    setSelectFrameIndex(index);
    setSelectMarkerIndex(0);
  };

  const handleDeleteFrame = () => {
    const newFrameUrls = frameUrls.filter((_, index) => index !== selectFrameIndex);
    const newFrames = frames.filter((frame) => frame.id !== frames[selectFrameIndex].id);
    setFrameUrls(newFrameUrls);
    setFrames(newFrames);
    setSelectMarkerIndex(0);
  };

  // FrameUrls
  const createFrameUrls = async (videoFile: File, frames: Frame[]) => {
    const url = URL.createObjectURL(videoFile);
    const newFrameUrls: string[] = [];

    const video = createVideoElement(url);
    const canvas = document.createElement('canvas');

    const loadedmetadataHandler = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      for (const frame of frames) {
        const newFrameUrl = await getFrameUrl(video, canvas, frame);
        newFrameUrls.push(newFrameUrl);
      }
    };

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', loadedmetadataHandler);
      document.body.removeChild(video);
    };

    return new Promise<string[]>((resolve) => {
      video.load();
      video.onloadeddata = async () => {
        await video.play();
        await loadedmetadataHandler();
        cleanup();
        resolve(newFrameUrls);
      };
    });
  };

  const handleScrollToSelectFrame = () => {
    viewport.current?.scrollTo({
      left: (128 / (9 / 16)) * selectFrameIndex,
      behavior: 'smooth',
    });
  };

  const handleClickDownloadDataUrls = async () => {
    if (frames.length === 0) {
      return;
    }
    showProgressModalHandler.open();
    const zip = new JSZip();
    const rootFolder = zip.folder('labeled_data');
    const folderNames = videos.map((video) => removeExtension(video.name));
    for (let i = 0; i < folderNames.length; i++) {
      const videoFolder = rootFolder?.folder(folderNames[i]);

      const author = 'TakayukiTooyama';

      const data = csvFormat(videoFrames[videos[i].name], author);
      const csvData = Papa.unparse(data);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      videoFolder?.file(`Collected_${author}.csv`, blob);
      const frameUrls: string[] = await createFrameUrls(
        videos[i].file,
        videoFrames[videos[i].name],
      );
      for (let j = 0; j < frameUrls.length; j++) {
        const imageData = await fetch(frameUrls[j]).then((res) => res.arrayBuffer());
        const blob = new Blob([imageData]);
        const fileName = `img${zeroPad(j)}.png`;
        videoFolder?.file(fileName, blob);
        setProgress((prev) => prev + 90 / folderNames.length / frameUrls.length);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      const percent = metadata.percent;
      const roundedPercent = Math.floor(percent / 10) * 10;
      if (percent === 100 || percent === roundedPercent) {
        setProgress((prev) => prev + roundedPercent / 10);
      }
    });

    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.download = 'download.zip';
    link.href = url;
    link.click();
  };

  // 続きから始めるとき、動画が選択ときの処理
  useEffect(() => {
    const video = createVideoElement(videoUrl);
    const canvas = document.createElement('canvas');

    const loadedmetadataHandler = async () => {
      setIsCreatingFrameUrls(true);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const newFrameUrls: string[] = [];
      for (const frame of frames) {
        const newFrameUrl = await getFrameUrl(video, canvas, frame);
        newFrameUrls.push(newFrameUrl);
      }
      setFrameUrls(newFrameUrls);
      setIsCreatingFrameUrls(false);
    };

    video.addEventListener('loadedmetadata', loadedmetadataHandler);

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', loadedmetadataHandler);
      document.body.removeChild(video);
    };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  useEffect(() => {
    if (progress >= 100) {
      setProgress(0);
      showProgressModalHandler.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // const logLocalStorageCapacity = () => {
  //   let totalSize = 0;
  //   for (const key in localStorage) {
  //     if (!localStorage.hasOwnProperty(key)) {
  //       continue;
  //     }
  //     totalSize += (localStorage[key].length + key.length) * 2;
  //   }
  // };

  return (
    <AppShell
      header={
        <Header
          onClick={() => handleToggle(showSidebarHandler)}
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
        video={videoRef.current}
        showDrawer={showSidebar}
        videos={videos}
        selectVideoIndex={selectVideoIndex}
        onClose={() => handleToggle(showSidebarHandler)}
        onAddVideo={handleAddVideo}
        onSelectVideo={handleSelectVideo}
      />
      <div className='flex h-full flex-col'>
        <div className='flex flex-1 '>
          <MarkerEditor
            labelingMode={labelingMode}
            viewMode={viewMode}
            frames={frames}
            selectMarkerIndex={selectMarkerIndex}
            toggleViewMode={toggleViewMode}
            toggleLabelingMode={toggleLabelingMode}
            setFrames={setFrames}
            setSelectMarkerIndex={setSelectMarkerIndex}
            updateVideoFrames={updateVideoFrames}
          />
          <Editor
            videoRef={videoRef}
            canvasRef={canvasRef}
            frameUrl={frameUrls}
            viewMode={viewMode}
            labelingMode={labelingMode}
            videoUrl={videoUrl}
            videos={videos}
            selectVideoIndex={selectVideoIndex}
            frames={frames}
            selectFrameIndex={selectFrameIndex}
            selectMarkerIndex={selectMarkerIndex}
            setFrames={setFrames}
            setFrameUrl={setFrameUrls}
            setSelectFrameIndex={setSelectFrameIndex}
            setSelectMarkerIndex={setSelectMarkerIndex}
          />
        </div>
        <div className='flex h-44'>
          {!isCreatingFrameUrls ? (
            <>
              {frames.length !== 0 && frames.length === frameUrls.length ? (
                <>
                  <FrameInfo selectFrame={frames[selectFrameIndex]} />
                  <div className='flex-1 overflow-hidden'>
                    <FrameList
                      viewport={viewport}
                      frameUrl={frameUrls}
                      frames={frames}
                      selectFrameIndex={selectFrameIndex}
                      onSelectFrame={handleSelectFrame}
                    />
                    <FrameOperation
                      frames={frames}
                      selectFrameIndex={selectFrameIndex}
                      onSelectFrame={handleSelectFrame}
                      onDeleteFrame={handleDeleteFrame}
                      onScrollToSelectFrame={handleScrollToSelectFrame}
                    />
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <Skeleton height='100%' width='100%' />
          )}
        </div>
      </div>
      {(videos.length === 0 && videoFrames) || (showDeleteModal && videoFrames) ? (
        <ContinueModal
          videos={videos}
          videoFrames={videoFrames}
          showModal={showDeleteModal}
          onAddVideo={handleAddVideo}
          onDeleteVideoFrames={handleDeleteVideoFrames}
        />
      ) : null}
      {showProgressModal ? (
        <Modal
          opened={showProgressModal}
          onClose={() => handleToggle(showProgressModalHandler)}
          withCloseButton={false}
        >
          <Progress value={progress} animate />
        </Modal>
      ) : null}
    </AppShell>
  );
};
export default EditorPage;
