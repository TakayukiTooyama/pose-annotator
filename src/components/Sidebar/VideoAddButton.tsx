import type { ButtonProps } from '@mantine/core';
import { FileButton, rem, Tooltip, UnstyledButton } from '@mantine/core';
import type { FC } from 'react';
import { TbPlus } from 'react-icons/tb';

import { useVideo } from '@/store';

type Props = ButtonProps;

export const VideoAddButton: FC<Props> = ({ ...props }) => {
  const { addVideo } = useVideo();
  return (
    <FileButton onChange={addVideo} accept='video/*' multiple {...props}>
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
};
