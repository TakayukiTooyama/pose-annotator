import { useScrollViewportStore } from '@/store';

export const useScrollViewport = () => {
  const frameListViewport = useScrollViewportStore((state) => state.frameListViewport);
  const markerListViewport = useScrollViewportStore((state) => state.markerListViewport);
  const frameListScroll = useScrollViewportStore((state) => state.frameListScroll);
  const markerListScroll = useScrollViewportStore((state) => state.markerListScroll);
  const setFrameListViewport = useScrollViewportStore((state) => state.setFrameListViewport);
  const setMarkerListViewport = useScrollViewportStore((state) => state.setMarkerListViewport);

  return {
    frameListViewport,
    markerListViewport,
    frameListScroll,
    markerListScroll,
    setFrameListViewport,
    setMarkerListViewport,
  };
};
