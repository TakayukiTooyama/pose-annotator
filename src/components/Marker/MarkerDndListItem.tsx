import { useSortable } from '@dnd-kit/sortable';
import { ActionIcon, ColorPicker, ColorSwatch, Flex, TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import type { FC } from 'react';
import { memo } from 'react';
import { TbGripVertical, TbSquareMinus } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { useUpdateMarkerOption } from '@/hooks';
import { useEditorMode, useMarkerSetting } from '@/store';
import type { MarkerOption } from '@/types';

type Props = {
  marker: MarkerOption;
  markers: MarkerOption[];
};

export const MarkerDndListItem: FC<Props> = memo(({ marker, markers }) => {
  const {
    isEdit,
    errorMessage,
    label,
    selectedMarker,
    showColorPicker,
    handleKeyDownEnter,
    handleBlur,
    handleClickTextInput,
    handleChangeLabel,
    openColorPicker,
    closeColorPicker,
  } = useUpdateMarkerOption();
  const { deleteMarkerOption, updateMarkerColor } = useMarkerSetting();

  const { processingMode } = useEditorMode();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: marker.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const colorPickerRef = useClickOutside(() => closeColorPicker());

  const handleChangeEnd = (color: string) => {
    updateMarkerColor(color, marker);
    closeColorPicker();
  };

  return (
    <Flex key={marker.id} className='relative w-full items-center space-x-2 ' style={style}>
      <ActionIcon ref={setNodeRef} {...attributes} {...listeners}>
        <TbGripVertical />
      </ActionIcon>
      <ColorSwatch
        component='button'
        color={marker.color}
        className='cursor-pointer'
        onClick={() => openColorPicker(marker)}
      />
      <Flex justify='space-between' align='center' className='flex-1'>
        {isEdit && marker === selectedMarker ? (
          <TextInput
            className='flex-1'
            variant='unstyled'
            value={label}
            error={errorMessage}
            onChange={handleChangeLabel}
            onKeyDown={handleKeyDownEnter}
            onBlur={handleBlur}
          />
        ) : (
          <TextInput
            readOnly
            className='flex-1'
            variant='unstyled'
            value={marker.label}
            onClick={() => handleClickTextInput(marker)}
          />
        )}
        {processingMode === 'annotation' ? (
          <IconButton
            variant='light'
            color='red'
            disabled={markers.length === 1}
            icon={TbSquareMinus}
            onClick={() => deleteMarkerOption(marker)}
          />
        ) : null}
      </Flex>
      {showColorPicker && marker === selectedMarker ? (
        <ColorPicker
          value={marker.color}
          onChangeEnd={handleChangeEnd}
          className='absolute left-7 top-10 z-10'
          ref={colorPickerRef}
        />
      ) : null}
    </Flex>
  );
});

MarkerDndListItem.displayName = 'MarkerDndListItem';
