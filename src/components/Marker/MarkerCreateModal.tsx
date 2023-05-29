import { Stack, TextInput } from '@mantine/core';
import type { FC } from 'react';

import { StretchModal } from '@/components/Common';
import { useCreateMarkerLabel } from '@/hooks';
import type { MarkerOption } from '@/types';

type Props = {
  showModal: boolean;
  children: React.ReactNode;
  markerOptions: MarkerOption[];
  createMarkerOption: (newLabel: string) => void;
  onClose: () => void;
};

export const MarkerCreateModal: FC<Props> = ({
  children,
  markerOptions,
  showModal,
  onClose,
  createMarkerOption,
}) => {
  const { newLabel, errorMessage, handleKeyDownEnter, handleChangeLabel } = useCreateMarkerLabel(
    markerOptions,
    createMarkerOption,
  );
  return (
    <StretchModal title='マーカー編集' showModal={showModal} onClose={onClose}>
      <Stack>
        <TextInput
          placeholder='+ Label'
          value={newLabel}
          error={errorMessage}
          onChange={handleChangeLabel}
          onKeyDown={handleKeyDownEnter}
        />
        {children}
      </Stack>
    </StretchModal>
  );
};
