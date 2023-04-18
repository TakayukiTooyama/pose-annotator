import { AlphaSlider, Slider, Stack, Text } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import type { FC, KeyboardEvent, SetStateAction } from 'react';
import { useCallback, useState } from 'react';

import {
  MarkerCounter,
  MarkerEditModal,
  MarkerList,
  MarkerOperation,
} from '@/components/Editor/Marker';
import { usePersistedMarkerStore } from '@/store';
import type { Frame, Marker, MarkerOption } from '@/types';
import { generateNewColor } from '@/utils';

type Props = {
  labelingMode: string;
  viewMode: string;
  frames: Frame[];
  selectMarkerIndex: number;
  toggleViewMode: () => void;
  toggleLabelingMode: () => void;
  setFrames: (frames: Frame[]) => void;
  setSelectMarkerIndex: (index: number) => void;
  updateVideoFrames: () => void;
};

export const MarkerEditor: FC<Props> = ({
  labelingMode,
  viewMode,
  frames,
  selectMarkerIndex,
  toggleViewMode,
  toggleLabelingMode,
  setFrames,
  setSelectMarkerIndex,
  updateVideoFrames,
}) => {
  const [showModal, showModalHandler] = useDisclosure(false);
  const [showColorPicker, showColorPickerHandler] = useDisclosure(false);

  const { markers, setMarkers } = usePersistedMarkerStore();
  const [selectMarker, setSelectMarker] = useState<MarkerOption | null>(null);
  const [inputLabel, setInputLabel] = useState('');
  const [newInputLabel, setNewInputLabel] = useState('');

  const handleCloseModal = () => {
    handleSaveFrameMarkers();
    showModalHandler.close();
  };
  const handleOpenModal = () => {
    updateVideoFrames();
    showModalHandler.open();
  };

  const handleToggleViewMode = () => {
    toggleViewMode();
  };

  const handleToggleLabelingMode = () => {
    toggleLabelingMode();
  };

  const handleShowColorPicker = useCallback((selectMarker: MarkerOption) => {
    setSelectMarker(selectMarker);
    setInputLabel(selectMarker.label);
    showColorPickerHandler.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHideColorPicker = useCallback(() => {
    setSelectMarker(null);
    setInputLabel('');
    showColorPickerHandler.close();
  }, [showColorPickerHandler]);

  const handleChangeColor = useCallback(
    (color: string, selectMarker: MarkerOption) => {
      const newMarkerOptions: MarkerOption[] = markers.map((marker) => ({
        ...marker,
        color: marker.label === selectMarker.label ? color : marker.color,
      }));
      setMarkers(newMarkerOptions);
    },
    [markers, setMarkers],
  );

  const handleCreateMarker = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, inputLabel: string) => {
      const newMarkerOption: MarkerOption = {
        id: '0',
        label: inputLabel,
        color: generateNewColor(),
      };
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        setMarkers([
          newMarkerOption,
          ...markers.map((marker, index) => ({
            ...marker,
            id: `${index + 1}`,
          })),
        ]);
        setNewInputLabel('');
      }
    },
    [markers, setMarkers],
  );

  const handleChangeEdit = useCallback((selectMarker: MarkerOption) => {
    setSelectMarker(selectMarker);
    setInputLabel(selectMarker.label);
  }, []);

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

  const handleCreateLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    handleEnglishOnlyInput(e, setNewInputLabel);
  }, []);

  const handleUpdateLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    handleEnglishOnlyInput(e, setInputLabel);
  }, []);

  const handleDeleteMarker = useCallback(
    (selectMarker: MarkerOption) => {
      const newMarkers = markers.filter((marker) => marker.label !== selectMarker.label);
      setMarkers(newMarkers);
    },
    [markers, setMarkers],
  );

  const handleBlurSaveLabel = useCallback(
    (selectMarker: MarkerOption) => {
      const newMarkers: MarkerOption[] = markers.map((marker) => ({
        ...marker,
        label:
          marker.label === selectMarker.label && marker.label !== '' ? inputLabel : marker.label,
      }));
      setMarkers(newMarkers);
      setSelectMarker(null);
      setInputLabel('');
    },
    [inputLabel, markers, setMarkers],
  );

  const handleKeyDownSaveLabel = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, selectMarker: MarkerOption) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBlurSaveLabel(selectMarker);
      }
    },
    [handleBlurSaveLabel],
  );

  const handleSaveFrameMarkers = useCallback(() => {
    if (frames.length === 0) {
      return;
    }

    const newFrames: Frame[] = frames.map((frame) => {
      const newMarkers: Marker[] = markers.map((marker) => {
        const existingPosition = frame.markers[selectMarkerIndex]?.position;
        return { label: marker.label, position: existingPosition || null };
      });

      return {
        ...frame,
        markers: newMarkers,
      };
    });

    setFrames(newFrames);
  }, [frames, markers, selectMarkerIndex, setFrames]);

  const handleChangeRadio = useCallback(
    (value: string) => {
      const selectMarkerIndex = markers.findIndex((marker) => marker.label === value);
      setSelectMarkerIndex(selectMarkerIndex);
    },
    [markers, setSelectMarkerIndex],
  );

  const { markerSetting, setMarkerSetting } = usePersistedMarkerStore();

  const handleChangeColorAlpha = useCallback(
    (value: number) => {
      setMarkerSetting({ ...markerSetting, opacity: value });
    },
    [markerSetting, setMarkerSetting],
  );

  const colorPickerRef = useClickOutside(handleHideColorPicker);

  return (
    <Stack className='w-32 p-2'>
      <MarkerOperation
        labelingMode={labelingMode}
        viewMode={viewMode}
        onToggleLabelingMode={handleToggleLabelingMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenModal={handleOpenModal}
      />
      <MarkerEditModal
        inputLabel={inputLabel}
        newInputLabel={newInputLabel}
        setMarkers={setMarkers}
        showModal={showModal}
        markers={markers}
        selectMarker={selectMarker}
        showColorPicker={showColorPicker}
        colorPickerRef={colorPickerRef}
        onCloseModal={handleCloseModal}
        onCreateMarker={handleCreateMarker}
        onDeleteMarker={handleDeleteMarker}
        onShowColorPicker={handleShowColorPicker}
        onChangeColor={handleChangeColor}
        onCreateLabel={handleCreateLabel}
        onUpdateLabel={handleUpdateLabel}
        onBlurSaveLabel={handleBlurSaveLabel}
        onKeyDownSaveLabel={handleKeyDownSaveLabel}
        onChangeEdit={handleChangeEdit}
      />
      <Stack className='h-32'>
        <div>
          <Text size='sm' color='gray'>
            SIZE
          </Text>
          <Slider
            mb='lg'
            w='100%'
            min={0}
            max={5}
            value={markerSetting.radius}
            onChange={(value) => setMarkerSetting({ ...markerSetting, radius: value })}
            marks={[
              { value: 0, label: '0' },
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ]}
          />
        </div>
        <div>
          <Text size='sm' color='gray'>
            OPACITY
          </Text>
          <AlphaSlider
            color='#1c7ed6'
            value={markerSetting.opacity}
            onChange={handleChangeColorAlpha}
            onChangeEnd={handleChangeColorAlpha}
          />
        </div>
      </Stack>

      <MarkerList
        markers={markers}
        selectMarkerIndex={selectMarkerIndex}
        onChangeRadio={handleChangeRadio}
      />
      <MarkerCounter markers={markers} />
    </Stack>
  );
};
