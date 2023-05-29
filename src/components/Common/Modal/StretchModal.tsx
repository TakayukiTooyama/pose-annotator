import { Modal, Stack } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  title: string;
  showModal: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export const StretchModal: FC<Props> = ({ children, title, showModal, onClose }) => (
  <Modal.Root opened={showModal} onClose={onClose} size='sm' padding='xl' centered>
    <Modal.Overlay />
    <Modal.Content
      style={{
        height: 'calc(100vh - (5vh * 2))',
        maxHeight: 'calc(100vh - (5vh * 2))',
      }}
    >
      <Modal.Header className='z-20'>
        <Modal.Title className='text-xl font-bold'>{title}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body
        style={{
          height: 'calc(100vh - (5vh * 2) - 76px)',
          maxHeight: 'calc(100vh - (5vh * 2) - 76px)',
        }}
      >
        <Stack>{children}</Stack>
      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
);
