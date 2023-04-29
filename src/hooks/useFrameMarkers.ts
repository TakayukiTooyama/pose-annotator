import { useLocalStorage } from '@mantine/hooks';
import { useCallback, useMemo, useState } from 'react';

import type { Frame, FrameMarkers, Marker } from '@/types';

export const useFrameMarkers = (selectFrame: Frame | null) => {
  const [frameMarkers, setFrameMarkers, removeFrameMarkers] = useLocalStorage<FrameMarkers>({
    key: 'frameMarkers',
    defaultValue: {},
  });
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);

  const markers = useMemo(
    () => frameMarkers[`${selectFrame?.videoName}-${selectFrame?.name}`] || [],
    [frameMarkers, selectFrame],
  );

  const handleAddMarkers = useCallback(
    (newMarkers: Marker[], newFrame: Frame) => {
      setFrameMarkers((prev) => ({
        ...prev,
        [`${newFrame.videoName}-${newFrame.name}`]: newMarkers,
      }));
    },
    [setFrameMarkers],
  );

  const handleUpdateMarkers = useCallback(
    (newMarkers: Marker[]) => {
      if (!selectFrame) {
        return;
      }
      setFrameMarkers((prev) => ({
        ...prev,
        [`${selectFrame.videoName}-${selectFrame.name}`]: newMarkers,
      }));
    },
    [selectFrame, setFrameMarkers],
  );

  const handleDeleteFrameMarkersWithFrame = useCallback(
    (frameId: string) => {
      if (markers) {
        const filteredFrameMarkers = Object.fromEntries(
          Object.entries(frameMarkers).filter(([key]) => key !== frameId),
        );

        setFrameMarkers(filteredFrameMarkers);
      }
    },
    [frameMarkers, markers, setFrameMarkers],
  );

  const handleMoveMarkerIndex = (index: number) => {
    if (index < 0 || index === markers.length) {
      return;
    }
    setCurrentMarkerIndex(index);
  };

  return {
    frameMarkers,
    markers,
    currentMarkerIndex,
    handleAddMarkers,
    handleUpdateMarkers,
    handleMoveMarkerIndex,
    removeFrameMarkers,
    handleDeleteFrameMarkersWithFrame,
  };
};
