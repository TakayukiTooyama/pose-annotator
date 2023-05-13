import { create } from 'zustand';

type State = {
  frameListViewport: HTMLDivElement | null;
  markerListViewport: HTMLDivElement | null;
};
type Action = {
  setFrameListViewport: (frameListViewport: HTMLDivElement | null) => void;
  setMarkerListViewport: (markerListViewport: HTMLDivElement | null) => void;
  frameListScroll: (index: number) => void;
  markerListScroll: (index: number) => void;
};

const FRAME_ASPECT_RATIO = 9 / 16;
const FRAME_HEIGHT = 128;
const MARKER_HEIGHT = 32;

export const useScrollViewportStore = create<State & Action>()((set, get) => ({
  frameListViewport: null,
  markerListViewport: null,
  setFrameListViewport: (frameListViewport: HTMLDivElement | null) => {
    set(() => ({ frameListViewport }));
  },
  setMarkerListViewport: (markerListViewport: HTMLDivElement | null) => {
    set(() => ({ markerListViewport }));
  },
  frameListScroll: (index: number) => {
    const scrollPosition = (FRAME_HEIGHT / FRAME_ASPECT_RATIO) * index;
    const viewport = get().frameListViewport;
    if (!viewport) {
      return;
    }
    viewport.scrollTo({
      left: scrollPosition,
      behavior: 'auto',
    });
  },
  markerListScroll: (index: number) => {
    const scrollPosition = MARKER_HEIGHT * index;
    const viewport = get().markerListViewport;
    if (!viewport) {
      return;
    }
    viewport.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  },
}));
