import { Button, Group } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  onFitImage: () => void;
};

export const CanvasOperation: FC<Props> = ({ onFitImage }) => (
  <Group spacing='sm' position='center'>
    <Button variant='default' onClick={onFitImage}>
      Fit
    </Button>
  </Group>
);
