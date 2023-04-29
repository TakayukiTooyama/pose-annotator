/* eslint-disable react-hooks/exhaustive-deps */
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useLocalStorage } from '@mantine/hooks';
import type { KeyboardEvent, SetStateAction } from 'react';
import { useCallback, useState } from 'react';

import type { MarkerOption, MarkerSetting } from '@/types';
import { defaultMarkerOption } from '@/types';
import { generateNewColor } from '@/utils';

export const useMarkerSetting = () => {
  const [markerSetting, setMarkerSetting] = useLocalStorage<MarkerSetting>({
    key: 'markerSetting',
    defaultValue: {
      radius: 3,
      opacity: 0.8,
      options: defaultMarkerOption,
    },
  });
  const [selectedMarker, setSelectedMarker] = useState<MarkerOption | null>(null);
  // 新しく作成する場合のラベル
  const [newLabel, setNewLabel] = useState('');
  // 編集する場合のラベル
  const [editingLabel, setEditingLabel] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // MarkerSetting
  const handleChangeColorAlpha = useCallback(
    (opacity: number) => {
      setMarkerSetting({ ...markerSetting, opacity });
    },
    [markerSetting, setMarkerSetting],
  );

  const handleChangeRadius = useCallback(
    (radius: number) => {
      setMarkerSetting({ ...markerSetting, radius });
    },
    [markerSetting, setMarkerSetting],
  );

  const handleUpdateMarkerOptions = useCallback((newMarkerOptions: MarkerOption[]) => {
    setMarkerSetting((prev) => ({ ...prev, options: newMarkerOptions }));
  }, []);

  // MarkerOption
  const handleCreateMarkerOption = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, newLabel: string) => {
      const newMarkerOption: MarkerOption = {
        id: '0',
        label: newLabel,
        color: generateNewColor(),
      };

      const newMarkerOptions = [
        newMarkerOption,
        ...markerSetting.options.map((marker, index) => ({
          ...marker,
          id: `${index + 1}`,
        })),
      ];

      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        setMarkerSetting((prev) => ({ ...prev, options: newMarkerOptions }));
        setNewLabel('');
      }
    },
    [markerSetting.options, setMarkerSetting],
  );

  const handleDeleteMarkerOption = useCallback((label: string) => {
    // const newMarkerOptions = markerSetting
    setMarkerSetting((prev) => ({
      ...prev,
      options: prev.options
        .filter((option) => option.label !== label)
        .map((marker, index) => ({ ...marker, id: `${index}` })),
    }));
  }, []);

  const handleUpdateMarkerColor = useCallback(
    (color: string, selectOption: MarkerOption) => {
      const newMarkerOptions: MarkerOption[] = markerSetting.options.map((marker) => ({
        ...marker,
        color: marker.label === selectOption.label ? color : marker.color,
      }));
      setMarkerSetting((prev) => ({ ...prev, options: newMarkerOptions }));
    },
    [markerSetting.options, setMarkerSetting],
  );

  // MarkerLabel
  const handleShowEditingLabelInput = (selectedMarker: MarkerOption | null) => {
    if (!selectedMarker) {
      return;
    }
    setSelectedMarker(selectedMarker);
    setEditingLabel(selectedMarker.label);
    setIsEdit(true);
  };

  const handleEnglishOnlyInput = (
    e: React.FormEvent<HTMLInputElement>,
    setInputValue: (value: SetStateAction<string>) => void,
  ) => {
    const nonEnglishPattern = /[^a-zA-Z\s]/g;
    const inputLabel = e.currentTarget.value;

    if (nonEnglishPattern.test(inputLabel)) {
      const updatedValue = inputLabel.replace(nonEnglishPattern, '');
      setInputValue(updatedValue);
    } else {
      setInputValue(inputLabel);
    }
  };

  const handleChangeNewLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    handleEnglishOnlyInput(e, setNewLabel);
  }, []);

  const handleChangeEditingLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    handleEnglishOnlyInput(e, setEditingLabel);
  }, []);

  const handleUpdateEditingLabel = useCallback(
    (selectOption: MarkerOption) => {
      const newMarkerOptions: MarkerOption[] = markerSetting.options.map((marker) => ({
        ...marker,
        label:
          marker.label === selectOption.label && marker.label !== '' ? editingLabel : marker.label,
      }));

      setMarkerSetting((prev) => ({ ...prev, options: newMarkerOptions }));
      setSelectedMarker(null);
      setEditingLabel('');
    },
    [editingLabel, markerSetting.options, setMarkerSetting],
  );

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent, selectOption: MarkerOption) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUpdateEditingLabel(selectOption);
      }
    },
    [handleUpdateEditingLabel],
  );

  // ColorPicker
  const handleToggleColorPicker = useCallback(
    (selectedMarker: MarkerOption | null) => {
      if (!selectedMarker) {
        return;
      }
      if (showColorPicker) {
        setSelectedMarker(null);
        setShowColorPicker(false);
      } else {
        setSelectedMarker(selectedMarker);
        setShowColorPicker(true);
      }
    },
    [showColorPicker],
  );

  // Drag & Drop
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = markerSetting.options.findIndex((marker) => marker.id === active.id);
      const newIndex = markerSetting.options.findIndex((marker) => marker.id === over.id);

      setMarkerSetting((prev) => ({
        ...prev,
        options: arrayMove([...markerSetting.options], oldIndex, newIndex),
      }));
    }
  };

  return {
    markerSetting,
    selectedMarker,
    editingLabel,
    newLabel,
    isEdit,
    showColorPicker,
    handleChangeColorAlpha,
    handleChangeRadius,
    handleUpdateMarkerOptions,
    handleCreateMarkerOption,
    handleDeleteMarkerOption,
    handleUpdateMarkerColor,
    handleChangeNewLabel,
    handleShowEditingLabelInput,
    handleChangeEditingLabel,
    handleUpdateEditingLabel,
    handleEnterKeyPress,
    handleToggleColorPicker,
    handleDragEnd,
  };
};
