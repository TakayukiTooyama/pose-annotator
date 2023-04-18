import { Group, UnstyledButton } from '@mantine/core';
import type { FC } from 'react';
import { TbMovie } from 'react-icons/tb';

import type { Video } from '@/types';

type Props = {
  video: Video;
  active: boolean;
  onSelectVideo: (video: Video) => void;
};

export const VideoListItem: FC<Props> = ({ video, onSelectVideo }) => (
  <UnstyledButton
    sx={(theme) => ({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      // backgroundColor: active
      //   ? theme.colorScheme === 'dark'
      //     ? theme.colors.dark[4]
      //     : theme.colors.gray[2]
      //   : 'transparent',

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    })}
    onClick={() => onSelectVideo(video)}
  >
    <Group>
      <TbMovie size={24} color='gray' />
      <span>{video.name}</span>
    </Group>
  </UnstyledButton>
);
