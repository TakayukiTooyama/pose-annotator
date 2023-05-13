import type { ActionIconProps, Variants } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import type { FC } from 'react';
import type { IconType } from 'react-icons';

type Props = {
  icon: IconType;
  onClick: any;
  variant?: Variants<
    'subtle' | 'filled' | 'outline' | 'light' | 'default' | 'transparent' | 'gradient'
  >;
  iconSize?: string;
} & ActionIconProps;

export const IconButton: FC<Props> = ({
  icon: Icon,
  onClick,
  variant = 'default',
  iconSize = '1.2rem',
  ...props
}) => (
  <ActionIcon size='lg' variant={variant} onClick={onClick} {...props} className='cursor-pointer'>
    <Icon size={iconSize} />
  </ActionIcon>
);
