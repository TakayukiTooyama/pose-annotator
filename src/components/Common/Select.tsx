import type { SelectProps } from '@mantine/core';
import { rem, Select as MantineSelect } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  value: string;
  data: { value: string; label: string }[];
  width?: number | string;
  onChange: (value: string) => void;
} & SelectProps;

export const Select: FC<Props> = ({ value, data, width = 200, onChange, ...props }) => (
  <MantineSelect
    value={value}
    data={data}
    styles={(theme) => ({
      item: {
        '&[data-selected]': {
          '&, &:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
            color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[9],
          },
        },
      },
      input: { width, textAlign: 'center', padding: rem(8) },
      rightSection: { display: 'none' },
    })}
    className='w-full'
    onChange={onChange}
    {...props}
  />
);
