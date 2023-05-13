import { useFrame } from '@/store/useFrame';
import { useMarkerStore } from '@/store/useMarkerStore';

export const useMarker = () => {
  const frameMarkers = useMarkerStore((state) => state.frameMarkers);
  const currentMarkerIndex = useMarkerStore((state) => state.currentMarkerIndex);
  const createFrameMarkers = useMarkerStore((state) => state.createFrameMarkers);
  const updateFrameMarkers = useMarkerStore((state) => state.updateFrameMarkers);
  const updateFrameMarkersByMarkerSetting = useMarkerStore(
    (state) => state.updateFrameMarkersByMarkerSetting,
  );
  const deleteFrameMarkers = useMarkerStore((state) => state.deleteFrameMarkers);
  const deleteAllFrameMarkers = useMarkerStore((state) => state.deleteAllFrameMarkers);
  const updateMarkers = useMarkerStore((state) => state.updateMarkers);
  const updateMarker = useMarkerStore((state) => state.updateMarker);
  const deleteMarker = useMarkerStore((state) => state.deleteMarker);
  const selectMarkerIndex = useMarkerStore((state) => state.selectMarkerIndex);
  const moveMarkerIndex = useMarkerStore((state) => state.moveMarkerIndex);

  const { frames, currentFrameIndex } = useFrame();
  const currentFrame = frames?.[currentFrameIndex] || null;
  const markers = currentFrame ? frameMarkers?.[currentFrame.id] : [];
  const selectedMarker = markers?.[currentMarkerIndex] || null;

  return {
    frameMarkers,
    markers,
    currentMarkerIndex,
    selectedMarker,
    createFrameMarkers,
    updateFrameMarkers,
    updateFrameMarkersByMarkerSetting,
    deleteFrameMarkers,
    deleteAllFrameMarkers,
    updateMarkers,
    updateMarker,
    deleteMarker,
    selectMarkerIndex,
    moveMarkerIndex,
  };
};
