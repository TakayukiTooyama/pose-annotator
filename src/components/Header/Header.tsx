import { Flex, Group, Header, rem, Title } from '@mantine/core';
import type { FC } from 'react';
import { TbLayoutSidebar, TbMoonStars, TbSun } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { DLCTrainingDataFormatter } from '@/components/Header';
import { useDarkMode } from '@/hooks';

type Props = {
  onOpenSidebar: () => void;
};

export const HeaderContents: FC<Props> = ({ onOpenSidebar }) => {
  const { colorScheme, toggleColorScheme } = useDarkMode();
  const dark = colorScheme === 'dark';

  return (
    <Header height={54} p='xs'>
      <Flex justify='space-between' align='center'>
        <Group w={rem(84)}>
          <IconButton icon={TbLayoutSidebar} onClick={onOpenSidebar} />
        </Group>

        <Title
          size='h3'
          sx={(theme) => ({
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
          })}
        >
          Pose Annotator
        </Title>

        <Group w={rem(84)}>
          <DLCTrainingDataFormatter />
          <IconButton icon={dark ? TbSun : TbMoonStars} onClick={() => toggleColorScheme()} />
        </Group>
      </Flex>
    </Header>
  );
};
