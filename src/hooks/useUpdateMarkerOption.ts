import { useCallback, useState } from 'react';

import { useMarkerSetting } from '@/store';
import type { MarkerOption } from '@/types';

export const useUpdateMarkerOption = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [label, setLabel] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MarkerOption | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { options, updateMarkerLabel, createMarkerOption } = useMarkerSetting();

  const handleChangeLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const inputLabel = e.currentTarget.value;
    if (/[^a-zA-Z0-9\-_]/g.test(inputLabel)) {
      setErrorMessage('英数字 -(ハイフン) _（アンダースコア）のみ使用できます。');
    } else {
      setErrorMessage('');
    }
    setLabel(inputLabel);
  }, []);

  const handleClickTextInput = useCallback((selectedMarker: MarkerOption) => {
    setSelectedMarker(selectedMarker);
    setLabel(selectedMarker.label);
    setIsEdit(true);
  }, []);

  const validateLabel = useCallback(
    (label: string, originalLabel?: string) => {
      if (label === '') {
        setErrorMessage('文字列を入力してください。');
        return false;
      }
      if (options.some((marker) => marker.label === label) && label !== originalLabel) {
        setErrorMessage('同じラベルが存在します');
        return false;
      }
      return true;
    },
    [options],
  );

  const resetState = () => {
    setIsEdit(false);
    setLabel('');
    setErrorMessage('');
  };

  const handleAction = useCallback(() => {
    if (errorMessage || !validateLabel(label, selectedMarker?.label)) {
      return;
    }
    if (selectedMarker) {
      updateMarkerLabel(label, selectedMarker);
    } else {
      createMarkerOption(label);
    }
    resetState();
  }, [errorMessage, label, selectedMarker, updateMarkerLabel, createMarkerOption, validateLabel]);

  const handleKeyDownEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    },
    [handleAction],
  );

  const handleBlur = () => {
    setLabel(selectedMarker?.label || '');
    setErrorMessage('');
  };

  const openColorPicker = (selectedMarker: MarkerOption) => {
    setSelectedMarker(selectedMarker);
    setShowColorPicker(true);
  };

  const closeColorPicker = () => {
    setSelectedMarker(null);
    setShowColorPicker(false);
  };

  return {
    isEdit,
    errorMessage,
    label,
    showColorPicker,
    selectedMarker,
    handleKeyDownEnter,
    handleBlur,
    handleClickTextInput,
    handleChangeLabel,
    openColorPicker,
    closeColorPicker,
  };
};
