import type { ButtonProps } from '@mantine/core';
import { Button, FileButton, Group } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  onAddVideo: (payload: File[]) => void;
} & ButtonProps;

export const VideoAddButton: FC<Props> = ({ onAddVideo, ...props }) => (
  <Group position='center'>
    <FileButton onChange={onAddVideo} accept='video/*' multiple {...props}>
      {(props) => <Button {...props}>動画追加</Button>}
    </FileButton>
  </Group>
);
