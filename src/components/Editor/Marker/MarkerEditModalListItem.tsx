import { useSortable } from '@dnd-kit/sortable';
import { ActionIcon, ColorPicker, ColorSwatch, Flex, TextInput } from '@mantine/core';
import type { FC, KeyboardEvent } from 'react';
import { memo } from 'react';
import { TbGripVertical, TbSquareMinus } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import type { MarkerOption } from '@/types';

type Props = {
  isEdit: boolean;
  marker: MarkerOption;
  editingLabel: string;
  showColorPicker: boolean;
  selectedMarker: MarkerOption | null;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  onDeleteMarkerOption: (label: string) => void;
  onUpdateEditingLabel: (marker: MarkerOption) => void;
  onEnterKeyPress: (e: KeyboardEvent<HTMLInputElement>, marker: MarkerOption) => void;
  onChangeEditingLabel: (e: React.FormEvent<HTMLInputElement>) => void;
  onToggleColorPicker: (selectedMarker: MarkerOption | null) => void;
  onUpdateMarkerColor: (value: string, marker: MarkerOption) => void;
  onShowEditingLabelInput: (selectedMarker: MarkerOption) => void;
};

export const MarkerEditModalListItem: FC<Props> = memo(
  ({
    isEdit,
    marker,
    editingLabel,
    showColorPicker,
    selectedMarker,
    colorPickerRef,
    onDeleteMarkerOption,
    onUpdateEditingLabel,
    onEnterKeyPress,
    onChangeEditingLabel,
    onToggleColorPicker,
    onUpdateMarkerColor,
    onShowEditingLabelInput,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: marker.id,
    });

    const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      transition,
    };

    return (
      <div key={marker.id} className='relative px-2 py-1' style={style}>
        <Flex className='w-full items-center space-x-2'>
          <ActionIcon ref={setNodeRef} {...attributes} {...listeners}>
            <TbGripVertical />
          </ActionIcon>
          <ColorSwatch
            component='button'
            color={marker.color}
            className='cursor-pointer'
            onClick={() => onToggleColorPicker(marker)}
          />
          <Flex justify='space-between' align='center' className='flex-1'>
            {isEdit && marker === selectedMarker ? (
              <TextInput
                className='flex-1'
                variant='unstyled'
                value={editingLabel}
                onChange={onChangeEditingLabel}
                onBlur={() => onUpdateEditingLabel(marker)}
                onKeyDown={(e) => onEnterKeyPress(e, marker)}
              />
            ) : (
              <TextInput
                readOnly
                className='flex-1'
                variant='unstyled'
                value={marker.label}
                onClick={() => onShowEditingLabelInput(marker)}
              />
            )}
            <IconButton
              variant='light'
              color='red'
              icon={TbSquareMinus}
              onClick={() => onDeleteMarkerOption(marker.label)}
            />
          </Flex>
        </Flex>
        {showColorPicker && marker === selectedMarker ? (
          <ColorPicker
            value={marker.color}
            onChangeEnd={(color) => onUpdateMarkerColor(color, marker)}
            className='absolute left-0 z-10'
            ref={colorPickerRef}
          />
        ) : null}
      </div>
    );
  },
);

MarkerEditModalListItem.displayName = 'MarkerEditModalListItem';
