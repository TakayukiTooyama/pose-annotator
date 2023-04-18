import { rem, Tooltip, UnstyledButton } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  label: string;
  index: string;
  active?: boolean;
  onClick?(): void;
};

export const SidebarButton: FC<Props> = ({
  index,
  label,
  // active,
  onClick,
}) => (
  <Tooltip label={label} position='right' transitionProps={{ duration: 0 }}>
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        width: rem(40),
        height: rem(40),
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
      })}
    >
      {index}
    </UnstyledButton>
  </Tooltip>
);
