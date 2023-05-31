import { ScrollArea, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { TbEdit } from 'react-icons/tb';

import { IconButton, Label, Select } from '@/components/Common';
import {
  MarkerCreateModal,
  MarkerDndList,
  MarkerList,
  MarkerOpacitySlider,
  MarkerSizeSlider,
} from '@/components/Marker';
import { useEditorMode, useMarker, useMarkerSetting, useScrollViewport } from '@/store';
import type { AnnotationMode } from '@/types';

export const AnnotationMarkerEditor: FC = () => {
  const markerListViewport = useRef<HTMLDivElement>(null);

  const [showModal, showModalHandler] = useDisclosure(false);
  const { markers, currentMarkerIndex, moveMarkerIndex } = useMarker();
  const { annotationMode, selectAnnotationMode } = useEditorMode();

  const { options, createMarkerOption, updateMarkerOptionsId } = useMarkerSetting();

  const { setMarkerListViewport } = useScrollViewport();

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
    () => markers.filter((marker) => marker.position !== null).map((marker) => marker.label),
    [markers],
  );

  return (
    <>
      {/* MarkerOperation */}
      <div className='flex items-center justify-between space-x-4'>
        <IconButton icon={TbEdit} onClick={handleOpenModal} />
        <Select
          value={annotationMode}
          width='100%'
          data={[
            { value: 'allParts', label: 'All Parts' },
            { value: 'onePart', label: 'One Part' },
          ]}
          onChange={(value) => selectAnnotationMode(value as AnnotationMode)}
        />
      </div>

      {/* MarkerList */}
      <ScrollArea.Autosize
        className='overflow-y-auto overflow-x-hidden'
        style={{ maxHeight: 'calc(100vh - 370px)' }}
        ref={markerListViewport}
      >
        <MarkerList
          markerOptions={options || []}
          currentMarkerIndex={currentMarkerIndex}
          labeledList={labeledList}
          moveMarkerIndex={moveMarkerIndex}
        />
      </ScrollArea.Autosize>

      {/* MarkerCounter */}
      <Label label={`${labeledList.length} / ${options?.length}`} />

      {/* MarkerOptionSlider */}
      <Stack className='h-32'>
        <MarkerSizeSlider />
        <MarkerOpacitySlider />
      </Stack>

      {/* MarkerEditModal */}
      <MarkerCreateModal
        markerOptions={options}
        showModal={showModal}
        onClose={handleCloseModal}
        createMarkerOption={createMarkerOption}
      >
        <MarkerDndList options={options} />
      </MarkerCreateModal>
    </>
  );
};
