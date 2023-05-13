import { Modal, Stack, TextInput } from '@mantine/core';
import type { FC } from 'react';

import { MarkerDndList } from '@/components/Marker';
import { useCreateMarkerLabel } from '@/hooks';

type Props = {
  onCloseModal: () => void;
  showModal: boolean;
};

// TODO:スケルトンを編集できるように
export const MarkerEditModal: FC<Props> = ({ showModal, onCloseModal }) => {
  const { newLabel, errorMessage, handleKeyDownEnter, handleChangeLabel } = useCreateMarkerLabel();
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
              placeholder='+ Label'
              value={newLabel}
              error={errorMessage}
              onChange={handleChangeLabel}
              onKeyDown={handleKeyDownEnter}
            />
            <MarkerDndList />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
