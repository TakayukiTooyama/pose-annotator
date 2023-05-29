import { defaultMarkerSetting } from '@/constant';
import { useMarkerSettingStore } from '@/store/useMarkerSettingStore';
import { useStore } from '@/store/useStore';

export const useMarkerSetting = () => {
  const options =
    useStore(useMarkerSettingStore, (state) => state.options) || defaultMarkerSetting.options;
  const calibrationOptions = useMarkerSettingStore((state) => state.calibrationOptions);
  const radius =
    useStore(useMarkerSettingStore, (state) => state.radius) || defaultMarkerSetting.radius;
  const opacity =
    useStore(useMarkerSettingStore, (state) => state.opacity) || defaultMarkerSetting.opacity;
  const updateMarkerLabel = useMarkerSettingStore((state) => state.updateMarkerLabel);
  const createMarkerOption = useMarkerSettingStore((state) => state.createMarkerOption);
  const updateMarkerColor = useMarkerSettingStore((state) => state.updateMarkerColor);
  const updateMarkerOptionsId = useMarkerSettingStore((state) => state.updateMarkerOptionsId);
  const updateMarkerOptions = useMarkerSettingStore((state) => state.updateMarkerOptions);
  const updateOpacity = useMarkerSettingStore((state) => state.updateOpacity);
  const updateRadius = useMarkerSettingStore((state) => state.updateRadius);
  const deleteAllMarkerOptions = useMarkerSettingStore((state) => state.deleteAllMarkerOptions);
  const deleteMarkerOption = useMarkerSettingStore((state) => state.deleteMarkerOption);

  return {
    options,
    calibrationOptions,
    radius,
    opacity,
    updateMarkerLabel,
    createMarkerOption,
    updateMarkerColor,
    updateMarkerOptionsId,
    updateMarkerOptions,
    updateOpacity,
    updateRadius,
    deleteAllMarkerOptions,
    deleteMarkerOption,
  };
};
