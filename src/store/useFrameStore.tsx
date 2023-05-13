import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useCanvasStore } from '@/store/useCanvasStore';
import { useMarkerStore } from '@/store/useMarkerStore';
import { useScrollViewportStore } from '@/store/useScrollViewportStore';
import { useVideoStore } from '@/store/useVideoStore';
import type { Frame, VideoFrames } from '@/types';
import { isIndexValid } from '@/utils';

type State = {
  videoFrames: VideoFrames;
  currentFrameIndex: number;
};
type Actions = {
  updateVideoFrames: (videoFrames: VideoFrames) => void;
  deleteVideoFrames: (videoName: string) => void;
  deleteAllVideoFrames: () => void;
  updateFrames: (newFrames: Frame[]) => void;
  addFrame: (video: HTMLVideoElement, nextFrameIndex: number) => void;
  deleteFrame: (selectedIndex: number) => void;
  selectFrameIndex: (index: number) => void;
  moveFrameIndex: (index: number) => void;
};

const insertFrame = (currentFrames: Frame[], newFrame: Frame, nextFrameIndex: number) => {
  if (nextFrameIndex !== -1) {
    return [
      ...currentFrames.slice(0, nextFrameIndex),
      newFrame,
      ...currentFrames.slice(nextFrameIndex),
    ];
  } else {
    return [...currentFrames, newFrame];
  }
};

export const useFrameStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      videoFrames: {},
      currentFrameIndex: 0,
      updateVideoFrames: (videoFrames: VideoFrames) => {
        set(() => ({ videoFrames }));
      },
      deleteVideoFrames: (videoName: string) => {
        set((state) => ({
          videoFrames: Object.fromEntries(
            Object.entries(state.videoFrames).filter(([key]) => key !== videoName),
          ),
        }));
      },
      deleteAllVideoFrames: () => set(() => ({ videoFrames: {} })),
      updateFrames: (newFrames: Frame[]) => {
        const selectedVideo = useVideoStore.getState().selectedVideo;
        if (!selectedVideo) {
          return;
        }
        set((state) => ({
          videoFrames: {
            ...state.videoFrames,
            [selectedVideo.name]: newFrames,
          },
        }));
      },
      addFrame: (video: HTMLVideoElement, nextFrameIndex: number) => {
        const selectedVideo = useVideoStore.getState().selectedVideo;
        if (!selectedVideo) {
          return;
        }
        const currentFrameNumber = Number(Math.round(video.currentTime / 0.03).toString());
        const newFrame: Frame = {
          id: `${selectedVideo.name}-${currentFrameNumber}`,
          name: `${currentFrameNumber}`,
          videoName: selectedVideo.name,
          dimensions: { width: video.videoWidth, height: video.videoHeight },
        };
        set((state) => ({
          videoFrames: {
            ...state.videoFrames,
            [selectedVideo.name]: insertFrame(
              state.videoFrames?.[selectedVideo.name] || [],
              newFrame,
              nextFrameIndex,
            ),
          },
        }));
      },
      deleteFrame: (selectedIndex: number) => {
        const selectedVideo = useVideoStore.getState().selectedVideo;
        if (!selectedVideo) {
          return;
        }
        useCanvasStore.getState().deleteCanvas(selectedIndex);
        if (get().videoFrames[selectedVideo.name].length === selectedIndex + 1) {
          get().moveFrameIndex(selectedIndex - 1);
        }
        set((state) => ({
          videoFrames: {
            ...state.videoFrames,
            [selectedVideo.name]: state.videoFrames[selectedVideo.name].filter(
              (_, index) => index !== selectedIndex,
            ),
          },
        }));
      },
      selectFrameIndex: (index: number) => {
        useMarkerStore.getState().selectMarkerIndex(0);
        useScrollViewportStore.getState().markerListScroll(0);
        useScrollViewportStore.getState().frameListScroll(index);
        set(() => ({ currentFrameIndex: index }));
      },
      moveFrameIndex: (index: number) => {
        const selectedVideo = useVideoStore.getState().selectedVideo;
        if (!selectedVideo) {
          return;
        }
        if (isIndexValid(index, get().videoFrames[selectedVideo.name].length)) {
          return;
        }
        useScrollViewportStore.getState().frameListScroll(index);
        set(() => ({ currentFrameIndex: index }));
      },
    }),
    {
      name: 'videoFrames',
      partialize: (state) => ({ videoFrames: state.videoFrames }),
    },
  ),
);
