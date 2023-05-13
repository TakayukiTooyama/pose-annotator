import { useFrameStore } from '@/store/useFrameStore';
import { useVideoStore } from '@/store/useVideoStore';

export const useFrame = () => {
  const videoFrames = useFrameStore((state) => state.videoFrames);
  const currentFrameIndex = useFrameStore((state) => state.currentFrameIndex);
  const selectedVideo = useVideoStore((state) => state.selectedVideo);
  const updateVideoFrames = useFrameStore((state) => state.updateVideoFrames);
  const deleteVideoFrames = useFrameStore((state) => state.deleteVideoFrames);
  const deleteAllVideoFrames = useFrameStore((state) => state.deleteAllVideoFrames);
  const addFrame = useFrameStore((state) => state.addFrame);
  const deleteFrame = useFrameStore((state) => state.deleteFrame);
  const selectFrameIndex = useFrameStore((state) => state.selectFrameIndex);
  const moveFrameIndex = useFrameStore((state) => state.moveFrameIndex);

  const frames =
    selectedVideo && videoFrames?.[selectedVideo.name] ? videoFrames[selectedVideo.name] : [];

  const selectedFrame = frames?.[currentFrameIndex] || null;

  return {
    videoFrames,
    frames,
    selectedFrame,
    currentFrameIndex,
    updateVideoFrames,
    deleteVideoFrames,
    deleteAllVideoFrames,
    addFrame,
    deleteFrame,
    selectFrameIndex,
    moveFrameIndex,
  };
};
