import { useVideoStore } from '@/store/useVideoStore';

export const useVideo = () => {
  const videos = useVideoStore((state) => state.videos);
  const selectedVideoUrl = useVideoStore((state) => state.selectedVideoUrl);
  const selectedVideo = useVideoStore((state) => state.selectedVideo);
  const currentVideoIndex = useVideoStore((state) => state.currentVideoIndex);
  const addVideo = useVideoStore((state) => state.addVideo);
  const deleteVideo = useVideoStore((state) => state.deleteVideo);
  const deleteAllVideos = useVideoStore((state) => state.deleteAllVideos);
  const selectVideoIndex = useVideoStore((state) => state.selectVideoIndex);
  const moveVideoIndex = useVideoStore((state) => state.moveVideoIndex);

  return {
    videos,
    selectedVideo,
    selectedVideoUrl,
    currentVideoIndex,
    addVideo,
    deleteVideo,
    deleteAllVideos,
    selectVideoIndex,
    moveVideoIndex,
  };
};
