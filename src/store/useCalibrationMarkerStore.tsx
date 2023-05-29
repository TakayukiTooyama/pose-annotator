import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { defaultCalibrationMarkerOption } from '@/constant';
import { useScrollViewportStore } from '@/store';
import type { CalibrationMarkers, Position, RealDimensions } from '@/types';
import { extractFilename, isIndexValid } from '@/utils';

type State = {
  realDimensions: RealDimensions;
  calibrationMarkers: CalibrationMarkers;
  currentCalibrationMarkerIndex: number;
};
type Action = {
  createCalibrationMarkers: (videoName: string) => void;
  updateCalibrationMarkers: (markers: CalibrationMarkers) => void;
  deleteCalibrationMarkers: (videoName: string) => void;
  deleteAllCalibrationMarkers: () => void;
  updateCalibrationMarker: (videoName: string, label: string, position: Position) => void;
  deleteCalibrationMarker: (videoName: string, label: string) => void;
  selectCalibrationMarkerIndex: (index: number) => void;
  moveCalibrationMarkerIndex: (index: number) => void;
  updateRealDimensions: (dimensions: RealDimensions) => void;
};

export const useCalibrationMarkerStore = create<State & Action>()(
  persist(
    (set, get) => ({
      calibrationMarkers: {},
      realDimensions: { width: '', height: '' },
      currentCalibrationMarkerIndex: 0,
      createCalibrationMarkers: (videoName: string) => {
        // if (get().calibrationMarkers.hasOwnProperty(videoName)) {
        //   return;
        // }

        const newCalibrationMarkers = defaultCalibrationMarkerOption.map((option) => ({
          label: option.label,
          position: null,
        }));

        set((state) => ({
          calibrationMarkers: {
            ...state.calibrationMarkers,
            [videoName]: newCalibrationMarkers,
          },
        }));
      },

      updateCalibrationMarkers: (calibrationMarkers: CalibrationMarkers) => {
        set(() => ({ calibrationMarkers }));
      },
      deleteCalibrationMarkers: (videoName: string) => {
        get().moveCalibrationMarkerIndex(0);
        set((state) => ({
          calibrationMarkers: Object.fromEntries(
            Object.entries(state.calibrationMarkers).filter(
              ([key]) => extractFilename(key) !== videoName,
            ),
          ),
        }));
      },
      deleteAllCalibrationMarkers: () =>
        set(() => ({
          calibrationMarkers: {},
        })),
      updateCalibrationMarker: (videoName: string, label: string, position: Position) =>
        set((state) => ({
          calibrationMarkers: {
            ...state.calibrationMarkers,
            [videoName]: state.calibrationMarkers?.[videoName].map((marker) =>
              marker.label === label ? { ...marker, position } : marker,
            ),
          },
        })),
      deleteCalibrationMarker: (videoName: string, label: string) => {
        const currentIndex = defaultCalibrationMarkerOption.findIndex(
          (option) => option.label === label,
        );
        get().moveCalibrationMarkerIndex(currentIndex);
        set((state) => ({
          calibrationMarkers: {
            ...state.calibrationMarkers,
            [videoName]: state.calibrationMarkers[videoName].map((marker) => {
              if (marker.label === label) {
                return {
                  ...marker,
                  position: null,
                };
              }
              return marker;
            }),
          },
        }));
      },
      selectCalibrationMarkerIndex: (index: number) => {
        useScrollViewportStore.getState().markerListScroll(index);
        set(() => ({ currentCalibrationMarkerIndex: index }));
      },
      moveCalibrationMarkerIndex: (index: number) => {
        if (isIndexValid(index, defaultCalibrationMarkerOption.length)) {
          return;
        }
        useScrollViewportStore.getState().markerListScroll(index);
        set(() => ({ currentCalibrationMarkerIndex: index }));
      },
      updateRealDimensions: (realDimensions: RealDimensions) => set(() => ({ realDimensions })),
    }),
    {
      name: 'calibrationMarkers',
      partialize: (state) => ({ calibrationMarkers: state.calibrationMarkers }),
    },
  ),
);
