import { useCalibrationMarkerStore, useVideo } from '@/store';

export const useCalibrationMarker = () => {
  const calibrationMarkers = useCalibrationMarkerStore((state) => state.calibrationMarkers);
  const realDimensions = useCalibrationMarkerStore((state) => state.realDimensions);
  const currentCalibrationMarkerIndex = useCalibrationMarkerStore(
    (state) => state.currentCalibrationMarkerIndex,
  );
  const createCalibrationMarkers = useCalibrationMarkerStore(
    (state) => state.createCalibrationMarkers,
  );
  const updateCalibrationMarkers = useCalibrationMarkerStore(
    (state) => state.updateCalibrationMarkers,
  );
  const deleteCalibrationMarkers = useCalibrationMarkerStore(
    (state) => state.deleteCalibrationMarkers,
  );
  const deleteAllCalibrationMarkers = useCalibrationMarkerStore(
    (state) => state.deleteAllCalibrationMarkers,
  );
  const updateCalibrationMarker = useCalibrationMarkerStore(
    (state) => state.updateCalibrationMarker,
  );
  const deleteCalibrationMarker = useCalibrationMarkerStore(
    (state) => state.deleteCalibrationMarker,
  );
  const selectCalibrationMarkerIndex = useCalibrationMarkerStore(
    (state) => state.selectCalibrationMarkerIndex,
  );
  const moveCalibrationMarkerIndex = useCalibrationMarkerStore(
    (state) => state.moveCalibrationMarkerIndex,
  );
  const updateRealDimensions = useCalibrationMarkerStore((state) => state.updateRealDimensions);

  const { selectedVideo } = useVideo();

  const markers =
    selectedVideo?.name && calibrationMarkers[selectedVideo.name]
      ? calibrationMarkers[selectedVideo.name]
      : [];

  const selectedCalibrationMarker = markers?.[currentCalibrationMarkerIndex] ?? null;

  return {
    markers,
    selectedCalibrationMarker,
    calibrationMarkers,
    currentCalibrationMarkerIndex,
    realDimensions,
    createCalibrationMarkers,
    updateCalibrationMarkers,
    deleteCalibrationMarkers,
    deleteAllCalibrationMarkers,
    updateCalibrationMarker,
    deleteCalibrationMarker,
    selectCalibrationMarkerIndex,
    moveCalibrationMarkerIndex,
    updateRealDimensions,
  };
};
