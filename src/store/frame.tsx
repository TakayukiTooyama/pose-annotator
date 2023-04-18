import { create } from 'zustand';

import type { Frame } from '@/types';

type FrameStore = {
  frames: Frame[];
  selectFrameIndex: number;
  frame: Frame | null;
  saveFrames: () => void;
  setFrame: (frame: Frame) => void;
  setFrames: (frames: Frame[]) => void;
  setSelectFrameIndex: (index: number) => void;
};

export const useFrameStore = create<FrameStore>((set, get) => ({
  frames: [],
  selectFrameIndex: 0,
  frame: null,
  saveFrames: () => {
    const currentFrame = get().frame;
    const newFrames = get().frames.map((frame) => ({
      ...(frame.id === currentFrame?.id ? currentFrame : frame),
    }));
    set(() => ({ frames: newFrames }));
  },
  setFrame: (frame) => {
    set(() => ({ frame }));
  },
  setFrames: (frames) => {
    const currentFrame = frames[get().selectFrameIndex];
    set(() => ({ frames, frame: currentFrame }));
  },
  setSelectFrameIndex: (index: number) => {
    const currentFrame = get().frames[index];
    set(() => ({
      selectFrameIndex: index,
      frame: currentFrame,
    }));
  },
}));
