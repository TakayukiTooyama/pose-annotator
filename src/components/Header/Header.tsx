import { Flex, Group, Header, Title } from '@mantine/core';
import type { FC } from 'react';
import { TbMoonStars, TbSun } from 'react-icons/tb';

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
        <Group>
          {/* <IconButton icon={TbLayoutSidebar} onClick={onOpenSidebar} /> */}
          <Title
            size='h3'
            sx={(theme) => ({
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
            })}
          >
            {/* Pose Annotator */}
          </Title>
        </Group>
        <Group>
          <DLCTrainingDataFormatter />
          <IconButton icon={dark ? TbSun : TbMoonStars} onClick={() => toggleColorScheme()} />
        </Group>
      </Flex>
    </Header>
  );
};
