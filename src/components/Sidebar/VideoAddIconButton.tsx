import { FileButton, rem, Tooltip, UnstyledButton } from '@mantine/core';
import type { FC } from 'react';
import { TbPlus } from 'react-icons/tb';

type Props = {
  onAddVideo: (payload: File[]) => void;
};

export const VideoAddIconButton: FC<Props> = ({ onAddVideo }) => (
  <FileButton onChange={onAddVideo} accept='video/*' multiple>
    {(props) => (
      <Tooltip label='動画追加' position='right' withArrow transitionProps={{ duration: 0 }}>
        <UnstyledButton
          sx={(theme) => ({
            width: rem(32),
            height: rem(32),
            border: `1px solid ${
              theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
            borderRadius: theme.radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            },
          })}
          {...props}
        >
          <TbPlus size='0.8rem' />
        </UnstyledButton>
      </Tooltip>
    )}
  </FileButton>
);
