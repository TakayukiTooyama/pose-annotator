import { create } from 'zustand';

import { useFrameStore } from '@/store/useFrameStore';
import type { Video } from '@/types';
import { createCanvasFromVideo, createVideoElement, extractFrames } from '@/utils';

type State = {
  canvases: HTMLCanvasElement[];
};
type Action = {
  createCanvases: (video: Video) => void;
  addCanvas: (videoElement: HTMLVideoElement, nextFrameIndex: number) => void;
  deleteCanvas: (selectedIndex: number) => void;
};

const insertCanvas = (
  currentCanvases: HTMLCanvasElement[],
  newCanvas: HTMLCanvasElement,
  nextFrameIndex: number,
) => {
  if (nextFrameIndex !== -1) {
    return [
      ...currentCanvases.slice(0, nextFrameIndex),
      newCanvas,
      ...currentCanvases.slice(nextFrameIndex),
    ];
  } else {
    return [...currentCanvases, newCanvas];
  }
};

export const useCanvasStore = create<State & Action>()((set, get) => ({
  canvases: [],
  createCanvases: async (video: Video) => {
    const videoFrames = useFrameStore.getState().videoFrames;
    const times = (videoFrames?.[video.name] || []).map((frame) =>
      parseFloat((Number(frame.name) / 30).toFixed(2)),
    );
    if (times.length > 0) {
      const videoUrl = URL.createObjectURL(video.file);
      const videoElement = createVideoElement(videoUrl);
      videoElement.load();
      const handleLoadedData = async () => {
        const canvases = await extractFrames(videoElement, times);
        set(() => ({ canvases }));
      };
      videoElement.addEventListener('loadeddata', handleLoadedData);
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    } else {
      set(() => ({ canvases: [] }));
    }
  },
  addCanvas: (videoElement: HTMLVideoElement, nextFrameIndex: number) => {
    const canvas = createCanvasFromVideo(videoElement);
    const newCanvases = insertCanvas(get().canvases, canvas, nextFrameIndex);
    set(() => ({ canvases: newCanvases }));
  },
  deleteCanvas: (selectedIndex: number) => {
    const newCanvases = get().canvases.filter((_, index) => index !== selectedIndex);
    set(() => ({ canvases: newCanvases }));
  },
}));
