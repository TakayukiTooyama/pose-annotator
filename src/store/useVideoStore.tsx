import * as R from 'remeda';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import { useCanvasStore } from '@/store/useCanvasStore';
import { useFrameStore } from '@/store/useFrameStore';
import { useMarkerStore } from '@/store/useMarkerStore';
import type { Video } from '@/types';
import { isIndexValid } from '@/utils';

type State = {
  videos: Video[];
  selectedVideo: Video | null;
  selectedVideoUrl: string;
  currentVideoIndex: number;
};
type Action = {
  addVideo: (payload: File[]) => void;
  deleteVideo: (index: number) => void;
  deleteAllVideos: () => void;
  selectVideoIndex: (index: number) => void;
  moveVideoIndex: (index: number) => void;
};

export const useVideoStore = create<State & Action>()((set, get) => ({
  videos: [],
  selectedVideo: null,
  selectedVideoUrl: '',
  currentVideoIndex: 0,
  addVideo: (payload: File[]) => {
    const newVideos: Video[] = payload.map((file) => ({
      id: uuid(),
      name: file.name,
      file,
    }));
    if (get().videos.length === 0) {
      useCanvasStore.getState().createCanvases(newVideos[0]);
    }
    if (!get().selectedVideoUrl) {
      set(() => ({
        selectedVideoUrl: URL.createObjectURL(newVideos[0].file),
        selectedVideo: newVideos[0],
      }));
    }
    set((prev) => ({
      videos: R.uniqBy([...prev.videos, ...newVideos], (video) => video.name),
    }));
  },
  deleteVideo: (index: number) => {
    const selectedVideo = get().videos[index];
    if (!selectedVideo) {
      return;
    }
    useFrameStore.getState().deleteVideoFrames(selectedVideo.name);
    useMarkerStore.getState().deleteFrameMarkers(selectedVideo.name);

    const newVideos = get().videos.filter((video) => video.name !== selectedVideo.name);
    const currentVideoIndex = get().currentVideoIndex;

    if (currentVideoIndex === index && get().videos.length === 1) {
      // 選択中のものを削除 & 削除後動画が存在しない
      set({
        videos: [],
        selectedVideoUrl: '',
        selectedVideo: null,
      });
    } else if (currentVideoIndex >= index) {
      // 選択中のものを削除 & 削除後動画が存在する || 削除対象より前のものを削除
      set({ videos: newVideos });
      get().selectVideoIndex(currentVideoIndex - 1);
    } else {
      // 削除対象より後ろのものを削除
      set({ videos: newVideos });
    }
  },
  deleteAllVideos: () => {
    useFrameStore.getState().deleteAllVideoFrames();
    useMarkerStore.getState().deleteAllFrameMarkers();
    set(() => ({ videos: [] }));
  },
  selectVideoIndex: (index: number) => {
    const selectedVideo = get().videos[index];
    if (get().selectedVideoUrl) {
      URL.revokeObjectURL(get().selectedVideoUrl);
    }

    useCanvasStore.getState().createCanvases(selectedVideo);
    useFrameStore.getState().selectFrameIndex(0);
    set(() => ({
      selectedVideo: selectedVideo,
      currentVideoIndex: index,
      selectedVideoUrl: URL.createObjectURL(selectedVideo.file),
    }));
  },
  moveVideoIndex: (index: number) => {
    if (isIndexValid(index, get().videos.length)) {
      return;
    }
    set(() => ({ currentVideoIndex: index }));
  },
}));
