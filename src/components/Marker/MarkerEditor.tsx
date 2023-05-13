import { AlphaSlider, Slider, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { TbAccessible, TbCameraPlus, TbClick, TbEdit, TbViewfinder } from 'react-icons/tb';

import { IconButton, Text } from '@/components/Common';
import { MarkerEditModal, MarkerList } from '@/components/Marker';
import { useMarker, useMarkerSetting, useScrollViewport } from '@/store';

type Props = {
  labelingMode: string;
  viewMode: string;
  toggleViewMode: () => void;
  toggleLabelingMode: () => void;
};

export const MarkerEditor: FC<Props> = ({
  labelingMode,
  viewMode,
  toggleViewMode,
  toggleLabelingMode,
}) => {
  const markerListViewport = useRef<HTMLDivElement>(null);

  const [showModal, showModalHandler] = useDisclosure(false);
  const { markers, currentMarkerIndex, moveMarkerIndex } = useMarker();
  const { options, radius, opacity, updateRadius, updateOpacity, updateMarkerOptionsId } =
    useMarkerSetting();
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
      <Stack className='w-36 p-2'>
        {/* MarkerOperation */}
        <div className='flex justify-between'>
          <IconButton icon={TbEdit} onClick={handleOpenModal} />
          <IconButton
            icon={labelingMode === 'allLabeling' ? TbAccessible : TbViewfinder}
            onClick={() => toggleLabelingMode()}
          />
          <IconButton
            icon={viewMode === 'frameExtraction' ? TbCameraPlus : TbClick}
            onClick={() => toggleViewMode()}
          />
        </div>

        {/* MarkerList */}
        <div
          className='cursor-pointer overflow-y-auto overflow-x-hidden'
          style={{ maxHeight: 'calc(100vh - 305px)' }}
          ref={markerListViewport}
        >
          <MarkerList
            markerOptions={options || []}
            currentMarkerIndex={currentMarkerIndex}
            labeledList={labeledList}
            moveMarkerIndex={moveMarkerIndex}
          />
        </div>

        {/* MarkerCounter */}
        <Text text={`${labeledList.length} / ${options?.length}`} />

        {/* MarkerOptionSlider */}
        <Stack className='h-32'>
          <div>
            <Text text='SIZE' size='xs' />
            <Slider
              mb='lg'
              w='100%'
              color='indigo'
              min={1}
              max={6}
              value={radius}
              onChange={updateRadius}
              marks={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
                { value: 6, label: '6' },
              ]}
            />
          </div>
          <div>
            <Text text='OPACITY' size='xs' />
            <AlphaSlider
              color='#536DED'
              value={opacity || 0.8}
              onChange={updateOpacity}
              onChangeEnd={updateOpacity}
            />
          </div>
        </Stack>
      </Stack>
      <MarkerEditModal showModal={showModal} onCloseModal={handleCloseModal} />
    </>
  );
};
