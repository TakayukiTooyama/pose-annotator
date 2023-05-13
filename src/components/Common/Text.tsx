import type { TextProps } from '@mantine/core';
import { Text as MantineText } from '@mantine/core';
import type { FC } from 'react';

type Props = {
  text: string;
} & TextProps;

export const Text: FC<Props> = ({ text, ...props }) => (
  <MantineText
    sx={(theme) => ({
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[6],
    })}
    {...props}
  >
    {text}
  </MantineText>
);
