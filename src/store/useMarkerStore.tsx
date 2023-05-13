import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useMarkerSettingStore } from '@/store/useMarkerSettingStore';
import { useScrollViewportStore } from '@/store/useScrollViewportStore';
import type { FrameMarkers, Marker, MarkerOption, Position } from '@/types';
import { extractFilename, isIndexValid } from '@/utils';

type State = {
  frameMarkers: FrameMarkers;
  currentMarkerIndex: number;
};
type Action = {
  createFrameMarkers: (frameId: string) => void;
  updateFrameMarkers: (frameMarkers: FrameMarkers) => void;
  updateFrameMarkersByMarkerSetting: (newMarkerOptions: MarkerOption[]) => void;
  deleteFrameMarkers: (videoName: string) => void;
  deleteAllFrameMarkers: () => void;
  updateMarkers: (frameId: string, markers: Marker[]) => void;
  deleteMarkers: (frameId: string) => void;
  updateMarker: (frameId: string, label: string, position: Position) => void;
  deleteMarker: (frameId: string, label: string) => void;
  selectMarkerIndex: (index: number) => void;
  moveMarkerIndex: (index: number) => void;
};

export const useMarkerStore = create<State & Action>()(
  persist(
    (set, get) => ({
      frameMarkers: {},
      currentMarkerIndex: 0,
      createFrameMarkers: (frameId: string) => {
        const markerOptions = useMarkerSettingStore.getState().options;
        const defaultMarkers: Marker[] = markerOptions.map((option) => ({
          label: option.label,
          position: null,
        }));
        set((state) => ({ frameMarkers: { ...state.frameMarkers, [frameId]: defaultMarkers } }));
      },
      updateFrameMarkers: (frameMarkers: FrameMarkers) => set(() => ({ frameMarkers })),
      updateFrameMarkersByMarkerSetting: (newMarkerOptions: MarkerOption[]) => {
        const frameMarkers: FrameMarkers = Object.entries(get().frameMarkers).reduce(
          (acc, [key, value]) => {
            const markers = newMarkerOptions.map((option) => {
              const marker = value.find((marker) => marker.label === option.label);
              return {
                label: option.label,
                position: marker?.position
                  ? {
                      x: marker.position.x,
                      y: marker.position.y,
                    }
                  : null,
              };
            });
            return { ...acc, [key]: markers };
          },
          {},
        );
        set(() => ({ frameMarkers }));
      },
      deleteFrameMarkers: (videoName: string) => {
        set((state) => ({
          frameMarkers: Object.fromEntries(
            Object.entries(state.frameMarkers).filter(
              ([key]) => extractFilename(key) !== videoName,
            ),
          ),
        }));
      },
      deleteAllFrameMarkers: () => set(() => ({ frameMarkers: {} })),
      updateMarkers: (frameId: string, markers: Marker[]) =>
        set((state) => ({
          frameMarkers: {
            ...state.frameMarkers,
            [frameId]: markers,
          },
        })),
      deleteMarkers: (frameId: string) =>
        set((state) => ({
          frameMarkers: Object.fromEntries(
            Object.entries(state.frameMarkers).filter(([key]) => key !== frameId),
          ),
        })),
      updateMarker: (frameId: string, label: string, position: Position) => {
        set((state) => ({
          frameMarkers: {
            ...state.frameMarkers,
            [frameId]: state.frameMarkers[frameId].map((marker) => {
              if (marker.label === label) {
                return {
                  label,
                  position,
                };
              }
              return marker;
            }),
          },
        }));
      },
      deleteMarker: (frameId: string, label: string) => {
        const selectedIndex = useMarkerSettingStore
          .getState()
          .options.findIndex((option) => option.label === label);
        get().selectMarkerIndex(selectedIndex);

        set((state) => ({
          frameMarkers: {
            ...state.frameMarkers,
            [frameId]: state.frameMarkers[frameId].map((marker) => {
              if (marker.label === label) {
                return { label, position: null };
              }
              return marker;
            }),
          },
        }));
      },
      selectMarkerIndex: (index: number) => {
        useScrollViewportStore.getState().markerListScroll(index);
        set(() => ({ currentMarkerIndex: index }));
      },
      moveMarkerIndex: (index: number) => {
        const markersOptions = useMarkerSettingStore.getState().options;
        if (isIndexValid(index, markersOptions.length)) {
          return;
        }
        useScrollViewportStore.getState().markerListScroll(index);
        set(() => ({ currentMarkerIndex: index }));
      },
    }),
    {
      name: 'frameMarkers',
      partialize: (state) => ({ frameMarkers: state.frameMarkers }),
    },
  ),
);
