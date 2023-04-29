import { AlphaSlider, Slider, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { FC } from 'react';
import { useCallback } from 'react';

import {
  MarkerCounter,
  MarkerEditModal,
  MarkerList,
  MarkerOperation,
} from '@/components/Editor/Marker';
import { useMarkerSetting } from '@/hooks/useMarkerSetting';
import type { Marker } from '@/types';

type Props = {
  labelingMode: string;
  viewMode: string;
  markers: Marker[];
  currentMarkerIndex: number;
  toggleViewMode: () => void;
  toggleLabelingMode: () => void;
  handleMoveMarkerIndex: (index: number) => void;
  handleUpdateMarkers: (newMarkers: Marker[]) => void;
};

export const MarkerEditor: FC<Props> = ({
  labelingMode,
  viewMode,
  markers,
  currentMarkerIndex,
  toggleViewMode,
  toggleLabelingMode,
  handleUpdateMarkers,
  handleMoveMarkerIndex,
}) => {
  const [showModal, showModalHandler] = useDisclosure(false);

  const {
    markerSetting,
    selectedMarker,
    editingLabel,
    newLabel,
    isEdit,
    showColorPicker,
    handleUpdateMarkerOptions,
    handleChangeColorAlpha,
    handleChangeRadius,
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
  } = useMarkerSetting();

  const handleCloseModal = () => {
    const newMarkerOptions = markerSetting.options.map((marker, index) => ({
      ...marker,
      id: `${index}`,
    }));
    const newMarkers: Marker[] = newMarkerOptions.map((marker) => {
      const existingPosition = markers[currentMarkerIndex]?.position;
      return { ...marker, position: existingPosition || null };
    });
    handleUpdateMarkerOptions(newMarkerOptions);
    handleUpdateMarkers(newMarkers);
    showModalHandler.close();
  };

  const handleOpenModal = () => {
    // updateVideoFrames();
    showModalHandler.open();
  };

  const handleToggleViewMode = () => {
    toggleViewMode();
  };

  const handleChangeRadio = useCallback(
    (value: string) => {
      const selectedMarkerIndex = markers.findIndex((marker) => marker.label === value);
      handleMoveMarkerIndex(selectedMarkerIndex);
    },
    [markers, handleMoveMarkerIndex],
  );

  const handleToggleLabelingMode = () => {
    toggleLabelingMode();
  };

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
        isEdit={isEdit}
        editingLabel={editingLabel}
        newLabel={newLabel}
        showModal={showModal}
        markerOptions={markerSetting.options}
        selectedMarker={selectedMarker}
        showColorPicker={showColorPicker}
        onCloseModal={handleCloseModal}
        onCreateMarkerOption={handleCreateMarkerOption}
        onDeleteMarkerOption={handleDeleteMarkerOption}
        onToggleColorPicker={handleToggleColorPicker}
        onUpdateMarkerColor={handleUpdateMarkerColor}
        onChangeNewLabel={handleChangeNewLabel}
        onChangeEditingLabel={handleChangeEditingLabel}
        onUpdateEditingLabel={handleUpdateEditingLabel}
        onEnterKeyPress={handleEnterKeyPress}
        onShowEditingLabelInput={handleShowEditingLabelInput}
        onDragEnd={handleDragEnd}
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
            onChange={handleChangeRadius}
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
        markerOptions={markerSetting.options}
        currentMarkerIndex={currentMarkerIndex}
        onChangeRadio={handleChangeRadio}
      />
      <MarkerCounter markerOptions={markerSetting.options} />
    </Stack>
  );
};
