import { UnstyledButton } from '@mantine/core';
import type { FC } from 'react';
import { TbMovie } from 'react-icons/tb';

import { Text } from '@/components/Common';
import type { Video } from '@/types';

type Props = {
  video: Video;
  active: boolean;
  onSelectVideo: () => void;
};

export const VideoListItem: FC<Props> = ({ active, video, onSelectVideo }) => (
  <UnstyledButton
    sx={(theme) => ({
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      padding: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      backgroundColor: active
        ? theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[2]
        : 'transparent',

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    })}
    className='space-x-2'
    onClick={onSelectVideo}
  >
    <TbMovie size={24} color='gray' />
    <Text
      text={video.name}
      className='absolute left-9  overflow-hidden'
      style={{ whiteSpace: 'normal', width: 'calc(100% - 56px)' }}
    />
  </UnstyledButton>
);
