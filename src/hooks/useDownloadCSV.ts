import JSZip from 'jszip';
import Papa from 'papaparse';
import { useState } from 'react';

import type { Frame, FrameMarkers, Video, VideoFrames } from '@/types';
import { createFrameUrls, csvFormat, removeExtension, zeroPad } from '@/utils';

export const useDownloadCSV = (
  videos: Video[],
  videoFrames: VideoFrames,
  frameMarkers: FrameMarkers,
  author: string,
) => {
  const [isDownload, setIsDownload] = useState(false);
  const [progress, setProgress] = useState(0);

  const createCSVFile = (
    videoFolder: JSZip | null,
    data: ReturnType<typeof csvFormat>,
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

  const handleClickDownloadDataUrls = async () => {
    setIsDownload(true);
    const zip = new JSZip();
    const rootFolder = zip.folder('labeled_data');
    const folderNames = videos.map((video) => removeExtension(video.name));

    if (rootFolder === null) {
      return;
    }

    for (let i = 0; i < folderNames.length; i++) {
      const videoFolder = rootFolder.folder(folderNames[i]);
      const data = csvFormat(videoFrames[videos[i].name], frameMarkers, author);
      createCSVFile(videoFolder, data, author);
      await createImageFiles(videoFolder, videos[i], videoFrames[videos[i].name]);
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
    setProgress(0);
    setIsDownload(false);
  };
  return {
    isDownload,
    progress,
    handleClickDownloadDataUrls,
  };
};
