import { useEffect } from 'react';
import { create } from 'zustand';

import type { MarkerOption, MarkerSetting } from '@/types';
import { defaultMarkerOption, defaultMarkerSetting } from '@/types';

type MarkerStore = {
  markers: MarkerOption[];
  markerSetting: MarkerSetting;
  selectMarkerIndex: number;
  setMarkers: (markers: MarkerOption[]) => Promise<void>;
  setMarkerSetting: (markerSetting: MarkerSetting) => Promise<void>;
  setSelectMarkerIndex: (selectMarkerIndex: number) => Promise<void>;
  addMarkers: (marker: MarkerOption) => Promise<void>;
};

const initialState: Pick<MarkerStore, 'markers' | 'markerSetting' | 'selectMarkerIndex'> = {
  markers: defaultMarkerOption,
  markerSetting: defaultMarkerSetting,
  selectMarkerIndex: 0,
};

const asyncStorage = {
  getItem: async (key: string): Promise<any> => {
    if (typeof window === 'undefined') {
      return null;
    }
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (key: string, value: any): Promise<void> => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
};

const useMarkerStore = create<MarkerStore>((set, get) => ({
  markers: initialState.markers,
  markerSetting: initialState.markerSetting,
  selectMarkerIndex: initialState.selectMarkerIndex,
  setMarkers: async (markers: MarkerOption[]): Promise<void> => {
    await asyncStorage.setItem('markers', markers);
    set({ markers });
  },
  setMarkerSetting: async (markerSetting: MarkerSetting): Promise<void> => {
    await asyncStorage.setItem('markerSetting', markerSetting);
    set({ markerSetting });
  },
  setSelectMarkerIndex: async (selectMarkerIndex: number): Promise<void> => {
    await asyncStorage.setItem('selectMarkerIndex', selectMarkerIndex);
    set({ selectMarkerIndex });
  },
  addMarkers: async (marker: MarkerOption): Promise<void> => {
    const newMarkers = [...get().markers, marker];
    await asyncStorage.setItem('markers', JSON.stringify(newMarkers));
    set({ markers: newMarkers });
  },
}));

export const usePersistedMarkerStore = (): MarkerStore => {
  const markerStore = useMarkerStore();
  const { setMarkers, setMarkerSetting, setSelectMarkerIndex } = markerStore;

  useEffect(() => {
    const loadPersistedState = async () => {
      const [markersFromStorage, markerSettingFromStorage, selectMarkerIndexFromStorage] =
        await Promise.all([
          asyncStorage.getItem('markers'),
          asyncStorage.getItem('markerSetting'),
          asyncStorage.getItem('selectMarkerIndex'),
        ]);

      if (markersFromStorage) {
        await setMarkers(markersFromStorage);
      }
      if (markerSettingFromStorage) {
        await setMarkerSetting(markerSettingFromStorage);
      }
      if (selectMarkerIndexFromStorage !== null) {
        await setSelectMarkerIndex(selectMarkerIndexFromStorage);
      }
    };

    loadPersistedState();
  }, [setMarkers, setMarkerSetting, setSelectMarkerIndex]);

  return markerStore;
};
