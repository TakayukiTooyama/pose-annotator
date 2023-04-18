import { useSortable } from '@dnd-kit/sortable';
import { ActionIcon, ColorPicker, ColorSwatch, Flex, TextInput } from '@mantine/core';
import type { FC, KeyboardEvent } from 'react';
import { memo } from 'react';
import { TbGripVertical, TbSquareMinus } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import type { MarkerOption } from '@/types';

type Props = {
  marker: MarkerOption;
  inputLabel: string;
  showColorPicker: boolean;
  selectMarker: MarkerOption | null;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  onDeleteMarker: (marker: MarkerOption) => void;
  onBlurSaveLabel: (marker: MarkerOption) => void;
  onKeyDownSaveLabel: (e: KeyboardEvent<HTMLInputElement>, marker: MarkerOption) => void;
  onUpdateLabel: (e: React.FormEvent<HTMLInputElement>) => void;
  onShowColorPicker: (marker: MarkerOption) => void;
  onChangeColor: (value: string, marker: MarkerOption) => void;
  onChangeEdit: (selectMarker: MarkerOption) => void;
};

export const MarkerEditModalListItem: FC<Props> = memo(
  ({
    marker,
    inputLabel,
    showColorPicker,
    selectMarker,
    colorPickerRef,
    onDeleteMarker,
    onChangeColor,
    onBlurSaveLabel,
    onKeyDownSaveLabel,
    onUpdateLabel,
    onShowColorPicker,
    onChangeEdit,
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
            onClick={() => onShowColorPicker(marker)}
          />
          <Flex justify='space-between' align='center' className='flex-1'>
            {marker === selectMarker ? (
              <TextInput
                className='flex-1'
                variant='unstyled'
                value={inputLabel}
                onChange={onUpdateLabel}
                onBlur={() => onBlurSaveLabel(marker)}
                onKeyDown={(e) => onKeyDownSaveLabel(e, marker)}
              />
            ) : (
              <TextInput
                readOnly
                className='flex-1'
                variant='unstyled'
                value={marker.label}
                onClick={() => onChangeEdit(marker)}
              />
            )}
            <IconButton
              variant='light'
              color='red'
              icon={TbSquareMinus}
              onClick={() => onDeleteMarker(marker)}
            />
          </Flex>
        </Flex>
        {showColorPicker && marker === selectMarker ? (
          <ColorPicker
            value={marker.color}
            onChangeEnd={(color) => onChangeColor(color, marker)}
            className='absolute left-0 z-10'
            ref={colorPickerRef}
          />
        ) : null}
      </div>
    );
  },
);

MarkerEditModalListItem.displayName = 'MarkerEditModalListItem';
