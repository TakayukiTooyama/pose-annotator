import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Modal, Stack, TextInput } from '@mantine/core';
import type { FC, KeyboardEvent } from 'react';
import { memo } from 'react';

import { MarkerEditModalListItem } from '@/components/Editor/Marker/MarkerEditModalListItem';
import type { MarkerOption } from '@/types';

type Props = {
  showModal: boolean;
  markers: MarkerOption[];
  inputLabel: string;
  newInputLabel: string;
  showColorPicker: boolean;
  selectMarker: MarkerOption | null;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  onCloseModal: () => void;
  onCreateMarker: (e: KeyboardEvent<HTMLInputElement>, inputLabel: string) => void;
  onDeleteMarker: (marker: MarkerOption) => void;
  onBlurSaveLabel: (marker: MarkerOption) => void;
  onKeyDownSaveLabel: (e: KeyboardEvent<HTMLInputElement>, marker: MarkerOption) => void;
  setMarkers: (markers: MarkerOption[]) => Promise<void>;
  onCreateLabel: (e: React.FormEvent<HTMLInputElement>) => void;
  onUpdateLabel: (e: React.FormEvent<HTMLInputElement>) => void;
  onShowColorPicker: (marker: MarkerOption) => void;
  onChangeColor: (value: string, marker: MarkerOption) => void;
  onChangeEdit: (selectMarker: MarkerOption) => void;
};

export const MarkerEditModal: FC<Props> = memo(
  ({
    showModal,
    markers,
    newInputLabel,
    inputLabel,
    showColorPicker,
    selectMarker,
    colorPickerRef,
    onCloseModal,
    onCreateMarker,
    onDeleteMarker,
    onChangeColor,
    onBlurSaveLabel,
    onKeyDownSaveLabel,
    setMarkers,
    onCreateLabel,
    onUpdateLabel,
    onShowColorPicker,
    onChangeEdit,
  }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const oldIndex = markers.findIndex((marker) => marker.id === active.id);
        const newIndex = markers.findIndex((marker) => marker.id === over.id);

        setMarkers(arrayMove(markers, oldIndex, newIndex));
      }
    };

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
                value={newInputLabel}
                onChange={onCreateLabel}
                onKeyDown={(e) => onCreateMarker(e, newInputLabel)}
              />
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e)}
                onDragCancel={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={markers} strategy={verticalListSortingStrategy}>
                  <div className='grid w-full p-4'>
                    {markers.map((marker) => (
                      <MarkerEditModalListItem
                        key={marker.id}
                        marker={marker}
                        inputLabel={inputLabel}
                        showColorPicker={showColorPicker}
                        selectMarker={selectMarker}
                        colorPickerRef={colorPickerRef}
                        onDeleteMarker={onDeleteMarker}
                        onChangeColor={onChangeColor}
                        onBlurSaveLabel={onBlurSaveLabel}
                        onKeyDownSaveLabel={onKeyDownSaveLabel}
                        onUpdateLabel={onUpdateLabel}
                        onShowColorPicker={onShowColorPicker}
                        onChangeEdit={onChangeEdit}
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
    prevProps.markers === nextProps.markers &&
    prevProps.selectMarker === nextProps.selectMarker &&
    prevProps.showColorPicker === nextProps.showColorPicker &&
    prevProps.newInputLabel === nextProps.newInputLabel &&
    prevProps.inputLabel === nextProps.inputLabel,
);

MarkerEditModal.displayName = 'MarkerEditModal';
