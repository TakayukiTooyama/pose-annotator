import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { defaultCalibrationMarkerOption, defaultMarkerOption } from '@/constant';
import { useEditorModeStore } from '@/store/useEditorModeStore';
import { useMarkerStore } from '@/store/useMarkerStore';
import type { MarkerOption } from '@/types';
import { generateNewColor } from '@/utils';

type State = {
  radius: number;
  opacity: number;
  options: MarkerOption[];
  calibrationOptions: MarkerOption[];
};
type Action = {
  createMarkerOption: (newLabel: string) => void;
  updateRadius: (newRadius: number) => void;
  updateOpacity: (newOpacity: number) => void;
  updateMarkerLabel: (newLabel: string, selectOption: MarkerOption) => void;
  updateMarkerColor: (newColor: string, selectOption: MarkerOption) => void;
  updateMarkerOptionsId: () => void;
  updateMarkerOptions: (newMarkerOptions: MarkerOption[]) => void;
  deleteMarkerOption: (selectOption: MarkerOption) => void;
  deleteAllMarkerOptions: () => void;
};

export const useMarkerSettingStore = create<State & Action>()(
  persist(
    (set, get) => ({
      radius: 3,
      opacity: 0.8,
      options: defaultMarkerOption,
      calibrationOptions: defaultCalibrationMarkerOption,
      createMarkerOption: (newLabel: string) => {
        const newMarkerOption: MarkerOption = {
          id: uuid(),
          label: newLabel,
          color: generateNewColor(),
        };

        set((state) => ({
          options: [
            newMarkerOption,
            ...state.options.map((marker, index) => ({
              ...marker,
              id: `${index + 1}`,
            })),
          ],
        }));
      },
      updateRadius: (newRadius: number) => {
        set(() => ({ radius: newRadius }));
      },
      updateOpacity: (newOpacity: number) => {
        set(() => ({ opacity: newOpacity }));
      },
      updateMarkerLabel: (newLabel: string, selectOption: MarkerOption) => {
        const processingMode = useEditorModeStore.getState().processingMode;
        if (processingMode === 'annotation') {
          set((state) => ({
            options: state.options.map((marker) => ({
              ...marker,
              label: marker.label === selectOption.label ? newLabel : marker.label,
            })),
          }));
        }
        if (processingMode === 'calibration') {
          set((state) => ({
            calibrationOptions: state.calibrationOptions.map((marker) => ({
              ...marker,
              label: marker.label === selectOption.label ? newLabel : marker.label,
            })),
          }));
        }
      },
      updateMarkerColor: (newColor: string, selectOption: MarkerOption) => {
        const processingMode = useEditorModeStore.getState().processingMode;
        if (processingMode === 'annotation') {
          set((state) => ({
            options: state.options.map((marker) => ({
              ...marker,
              color: marker.label === selectOption.label ? newColor : marker.color,
            })),
          }));
        }
        if (processingMode === 'calibration') {
          set((state) => ({
            calibrationOptions: state.calibrationOptions.map((marker) => ({
              ...marker,
              color: marker.label === selectOption.label ? newColor : marker.color,
            })),
          }));
        }
      },
      updateMarkerOptionsId: () => {
        const processingMode = useEditorModeStore.getState().processingMode;
        if (processingMode === 'annotation') {
          set((state) => ({
            options: state.options.map((marker, index) => ({
              ...marker,
              id: `${index}`,
            })),
          }));
        }
        if (processingMode === 'calibration') {
          set((state) => ({
            calibrationOptions: state.calibrationOptions.map((marker, index) => ({
              ...marker,
              id: `${index}`,
            })),
          }));
        }
      },
      updateMarkerOptions: (newMarkerOptions: MarkerOption[]) => {
        const processingMode = useEditorModeStore.getState().processingMode;
        if (processingMode === 'annotation') {
          set(() => ({ options: newMarkerOptions }));
        }
        if (processingMode === 'calibration') {
          set(() => ({ calibrationOptions: newMarkerOptions }));
        }
      },
      deleteMarkerOption: (selectOption: MarkerOption) => {
        const newOptions = get()
          .options.filter((option) => option.label !== selectOption.label)
          .map((marker, index) => ({
            ...marker,
            id: `${index}`,
          }));

        const currentMarkerIndex = useMarkerStore.getState().currentMarkerIndex;
        const selectedIndex = get().options.findIndex(
          (option) => option.label === selectOption.label,
        );

        if (currentMarkerIndex > selectedIndex && get().options.length > 1) {
          useMarkerStore.getState().selectMarkerIndex(currentMarkerIndex - 1);
        }
        useMarkerStore.getState().updateFrameMarkersByMarkerSetting(newOptions);
        set(() => ({ options: newOptions }));
      },
      deleteAllMarkerOptions: () => {
        useMarkerStore.getState().selectMarkerIndex(0);
        useMarkerStore.getState().updateFrameMarkers({});
        set(() => ({ options: [] }));
      },
    }),
    {
      name: 'markerSetting',
    },
  ),
);
