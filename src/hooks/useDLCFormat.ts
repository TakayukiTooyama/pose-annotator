import JSZip from 'jszip';
import Papa from 'papaparse';
import { useState } from 'react';

import { useFrameStore, useMarkerStore, useStore, useVideo } from '@/store';
import type { Frame, Video } from '@/types';
import { createFrameUrls, formatDLC, removeExtension, zeroPad } from '@/utils';

export const useDLCFormat = (author: string) => {
  const [isDownload, setIsDownload] = useState(false);
  const [progress, setProgress] = useState(0);

  const { videos } = useVideo();
  const videoFrames = useStore(useFrameStore, (state) => state.videoFrames);
  const frameMarkers = useStore(useMarkerStore, (state) => state.frameMarkers);

  const createCSVFile = (
    videoFolder: JSZip | null,
    data: ReturnType<typeof formatDLC>,
    author: string,
  ): void => {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    videoFolder?.file(`Collected_${author}.csv`, blob);
  };

  const createImageFiles = async (
    videoFolder: JSZip | null,
    video: Video,
    frames: Frame[],
  ): Promise<void> => {
    const frameUrls = await createFrameUrls(video.file, frames);

    await Promise.all(
      frameUrls.map(async (frameUrl, index) => {
        const imageData = await fetch(frameUrl).then((res) => res.arrayBuffer());
        const imageBlob = new Blob([imageData], { type: 'image/png' });
        const frameNumber = Number(frames[index].name);
        const fileName = `img${zeroPad(frameNumber)}.png`;
        videoFolder?.file(fileName, imageBlob);
        setProgress((prev) => prev + 90 / videos.length / frameUrls.length);
      }),
    );
  };

  const createLabelDataFolder = async () => {
    if (!videoFrames || !frameMarkers) {
      return;
    }

    const zip = new JSZip();
    const rootFolder = zip.folder('labeled_data');
    const folderNames = videos.map((video) => removeExtension(video.name));

    if (rootFolder === null) {
      return;
    }

    for (let i = 0; i < folderNames.length; i++) {
      const videoFolder = rootFolder.folder(folderNames[i]);
      const formatAnnotationDataToDLCData = formatDLC(
        videoFrames[videos[i].name],
        frameMarkers,
        author,
      );
      createCSVFile(videoFolder, formatAnnotationDataToDLCData, author);
      await createImageFiles(videoFolder, videos[i], videoFrames[videos[i].name]);
    }
    const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      const percent = metadata.percent;
      const roundedPercent = Math.floor(percent / 10) * 10;
      if (percent === 100 || percent === roundedPercent) {
        setProgress((prev) => prev + roundedPercent / 10);
      }
    });
    return content;
  };

  const downloadFormatData = async () => {
    setIsDownload(true);
    const content = await createLabelDataFolder();
    if (content) {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = 'download.zip';
      link.href = url;
      link.click();
      setIsDownload(false);
    }
  };

  return {
    frameMarkers,
    isDownload,
    progress,
    downloadFormatData,
  };
};
