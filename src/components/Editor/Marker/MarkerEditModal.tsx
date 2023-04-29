import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Modal, Stack, TextInput } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import type { FC, FormEvent, KeyboardEvent } from 'react';
import { memo } from 'react';

import { MarkerEditModalListItem } from '@/components/Editor/Marker/MarkerEditModalListItem';
import type { MarkerOption } from '@/types';

type Props = {
  isEdit: boolean;
  showModal: boolean;
  markerOptions: MarkerOption[];
  editingLabel: string;
  newLabel: string;
  showColorPicker: boolean;
  selectedMarker: MarkerOption | null;
  onCloseModal: () => void;
  onCreateMarkerOption: (e: KeyboardEvent<HTMLInputElement>, inputLabel: string) => void;
  onDeleteMarkerOption: (label: string) => void;
  onToggleColorPicker: (selectedMarker: MarkerOption | null) => void;
  onUpdateMarkerColor: (color: string, selectOption: MarkerOption) => void;
  onChangeNewLabel: (e: FormEvent<HTMLInputElement>) => void;
  onChangeEditingLabel: (e: FormEvent<HTMLInputElement>) => void;
  onUpdateEditingLabel: (selectOption: MarkerOption) => void;
  onEnterKeyPress: (e: KeyboardEvent<Element>, selectOption: MarkerOption) => void;
  onShowEditingLabelInput: (selectedMarker: MarkerOption) => void;
  onDragEnd: ({ active, over }: DragEndEvent) => void;
};

export const MarkerEditModal: FC<Props> = memo(
  ({
    isEdit,
    showModal,
    markerOptions,
    editingLabel,
    newLabel,
    showColorPicker,
    selectedMarker,
    onCloseModal,
    onCreateMarkerOption,
    onDeleteMarkerOption,
    onToggleColorPicker,
    onUpdateMarkerColor,
    onChangeNewLabel,
    onChangeEditingLabel,
    onUpdateEditingLabel,
    onEnterKeyPress,
    onShowEditingLabelInput,
    onDragEnd,
  }) => {
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
      }),
    );

    const colorPickerRef = useClickOutside(() => onToggleColorPicker(selectedMarker));

    return (
      <Modal.Root opened={showModal} onClose={onCloseModal} size='sm' padding='xl' centered>
        <Modal.Overlay />
        <Modal.Content
          style={{
            height: 'calc(100vh - (5vh * 2))',
            maxHeight: 'calc(100vh - (5vh * 2))',
          }}
        >
          <Modal.Header className='z-20'>
            <Modal.Title className='text-xl font-bold'>マーカー編集</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body
            style={{
              height: 'calc(100vh - (5vh * 2) - 76px)',
              maxHeight: 'calc(100vh - (5vh * 2) - 76px)',
            }}
          >
            <Stack>
              <TextInput
                label='English-only input'
                placeholder='+ Label'
                value={newLabel}
                onChange={onChangeNewLabel}
                onKeyDown={(e) => onCreateMarkerOption(e, newLabel)}
              />
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
                onDragCancel={onDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={markerOptions} strategy={verticalListSortingStrategy}>
                  <div className='grid w-full p-4'>
                    {markerOptions?.map((marker) => (
                      <MarkerEditModalListItem
                        key={marker.id}
                        isEdit={isEdit}
                        marker={marker}
                        editingLabel={editingLabel}
                        showColorPicker={showColorPicker}
                        selectedMarker={selectedMarker}
                        colorPickerRef={colorPickerRef}
                        onDeleteMarkerOption={onDeleteMarkerOption}
                        onUpdateMarkerColor={onUpdateMarkerColor}
                        onUpdateEditingLabel={onUpdateEditingLabel}
                        onEnterKeyPress={onEnterKeyPress}
                        onChangeEditingLabel={onChangeEditingLabel}
                        onToggleColorPicker={onToggleColorPicker}
                        onShowEditingLabelInput={onShowEditingLabelInput}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    );
  },
  (prevProps, nextProps) =>
    prevProps.showModal === nextProps.showModal &&
    prevProps.markerOptions === nextProps.markerOptions &&
    prevProps.selectedMarker === nextProps.selectedMarker &&
    prevProps.showColorPicker === nextProps.showColorPicker &&
    prevProps.newLabel === nextProps.newLabel &&
    prevProps.editingLabel === nextProps.editingLabel,
);

MarkerEditModal.displayName = 'MarkerEditModal';
