import type { DefaultMantineColor, Variants } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import type { FC } from 'react';
import type { IconType } from 'react-icons';

type Props = {
  icon: IconType;
  color?: DefaultMantineColor;
  variant?: Variants<
    'gradient' | 'subtle' | 'filled' | 'outline' | 'light' | 'default' | 'transparent'
  >;
  onClick: any;
};

export const IconButton: FC<Props> = ({ icon: Icon, variant = 'default', color, onClick }) => (
  <ActionIcon size='lg' variant={variant} onClick={onClick} color={color}>
    <Icon size='1.2rem' />
  </ActionIcon>
);
