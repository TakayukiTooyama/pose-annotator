/* eslint-disable import/no-default-export */
import * as R from 'remeda';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import type { Video } from '@/types';

export interface VideoStore {
  videos: Video[];
  selectVideoIndex: number;
  selectedVideo: Video | null;
  addVideo: (name: string, file: File) => void;
  removeVideo: (id: string) => void;
  setSelectVideoIndex: (index: number) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  selectVideoIndex: 0,
  selectedVideo: null,
  addVideo: (name: string, file: File) => {
    const id = uuid();
    const newVideo: Video = { id, name, file };
    set((state) => ({ videos: R.uniqBy([...state.videos, newVideo], (video) => video.name) }));
  },
  removeVideo: (id: string) => {
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id),
    }));
  },
  setSelectVideoIndex: (index: number) => {
    set({ selectVideoIndex: index });
  },
}));
