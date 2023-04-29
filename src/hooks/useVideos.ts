import { useState } from 'react';
import * as R from 'remeda';
import { v4 as uuid } from 'uuid';

import type { Video } from '@/types';

const _createNewVideoList = (payload: File[], prev: Video[]) => {
  const newVideos: Video[] = payload.map((file) => ({
    id: uuid(),
    name: file.name,
    file,
  }));
  return R.uniqBy([...prev, ...newVideos], (video) => video.name);
};

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  const handleAddVideo = (payload: File[]) => {
    if (!selectedVideoUrl) {
      setSelectedVideoUrl(URL.createObjectURL(payload[0]));
    }

    setVideos((prev) => _createNewVideoList(payload, prev));
  };

  const handleSelectedVideo = async (index: number, video: HTMLVideoElement | null) => {
    if (videos.length - 1 < index || !video) {
      return;
    }
    if (selectedVideoUrl) {
      URL.revokeObjectURL(selectedVideoUrl);
    }

    const newVideoUrl = URL.createObjectURL(videos[index].file);
    setSelectedVideoUrl(newVideoUrl);
    setCurrentVideoIndex(index);
  };

  return { videos, selectedVideoUrl, currentVideoIndex, handleAddVideo, handleSelectedVideo };
};
