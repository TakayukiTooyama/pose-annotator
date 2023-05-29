import { Modal, Stack } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
  showModal: boolean;
  onClose: () => void;
};

export const FitModal: FC<Props> = ({ children, title, showModal, onClose }) => (
  <Modal.Root opened={showModal} onClose={onClose} size='sm' padding='xl' centered>
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <Modal.Title className='text-xl font-bold'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack>{children}</Stack>
      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
);
