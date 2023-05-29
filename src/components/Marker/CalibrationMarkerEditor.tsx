import { ScrollArea, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { TbEdit } from 'react-icons/tb';

import { FitModal, IconButton, Label, Select } from '@/components/Common';
import {
  MarkerDndList,
  MarkerList,
  MarkerOpacitySlider,
  MarkerSizeSlider,
} from '@/components/Marker';
import { defaultCalibrationMarkerOption } from '@/constant';
import { useCalibrationMarker, useEditorMode, useMarkerSetting, useScrollViewport } from '@/store';
import type { CalibrationMode } from '@/types';

export const CalibrationMarkerEditor: FC = () => {
  const markerListViewport = useRef<HTMLDivElement>(null);

  const [showModal, showModalHandler] = useDisclosure(false);
  const {
    markers: calibrationMarkers,
    currentCalibrationMarkerIndex,
    moveCalibrationMarkerIndex,
  } = useCalibrationMarker();
  const { calibrationOptions, updateMarkerOptionsId } = useMarkerSetting();

  const { setMarkerListViewport } = useScrollViewport();
  const { calibrationMode, selectCalibrationMode } = useEditorMode();

  useEffect(() => {
    setMarkerListViewport(markerListViewport.current);
  }, [setMarkerListViewport]);

  const handleOpenModal = () => {
    showModalHandler.open();
  };

  const handleCloseModal = () => {
    updateMarkerOptionsId();
    showModalHandler.close();
  };

  const labeledList = useMemo(
    () =>
      calibrationMarkers.filter((marker) => marker.position !== null).map((marker) => marker.label),
    [calibrationMarkers],
  );

  return (
    <>
      <Stack className='p-4'>
        {/* MarkerOperation */}
        <div className='flex items-center justify-between space-x-4 '>
          <IconButton icon={TbEdit} onClick={handleOpenModal} />
          <Select
            value={calibrationMode}
            width='100%'
            data={[
              { value: 'static', label: '2次元4点実長換算' },
              { value: 'panningWithMarkers', label: 'パンニング - マーカーあり' },
              { value: 'panningWithoutMarkers', label: 'パンニング - マーカーなし' },
            ]}
            onChange={(value) => selectCalibrationMode(value as CalibrationMode)}
          />
        </div>

        {/* MarkerList */}
        <ScrollArea.Autosize
          className='overflow-y-auto overflow-x-hidden'
          style={{ maxHeight: 'calc(100vh - 320px)' }}
          ref={markerListViewport}
        >
          <MarkerList
            markerOptions={defaultCalibrationMarkerOption}
            currentMarkerIndex={currentCalibrationMarkerIndex}
            labeledList={labeledList}
            moveMarkerIndex={moveCalibrationMarkerIndex}
          />
        </ScrollArea.Autosize>

        {/* MarkerCounter */}
        <Label label={`${labeledList.length} / ${defaultCalibrationMarkerOption.length}`} />

        {/* MarkerOptionSlider */}
        <Stack className='h-32'>
          <MarkerSizeSlider />
          <MarkerOpacitySlider />
        </Stack>
      </Stack>

      {/* MarkerEditModal */}
      <FitModal title='マーカー編集' showModal={showModal} onClose={handleCloseModal}>
        <MarkerDndList options={calibrationOptions} />
      </FitModal>
    </>
  );
};
