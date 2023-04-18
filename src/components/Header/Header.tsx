import { ActionIcon, Flex, Group, Header, Title } from '@mantine/core';
import type { FC } from 'react';
import { TbFileDownload, TbLayoutSidebar, TbMoonStars, TbSun } from 'react-icons/tb';

import { useDarkMode } from '@/hooks/useDarkMode';
import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
  onClick: () => void;
  onClickDownloadDataUrls: () => void;
};

export const HeaderContents: FC<Props> = ({ frames, onClick, onClickDownloadDataUrls }) => {
  const { colorScheme, toggleColorScheme } = useDarkMode(); // カスタムフックを使用
  const dark = colorScheme === 'dark';

  return (
    <Header height={54} p='xs'>
      <Flex justify='space-between' align='center'>
        <ActionIcon variant='default' size='lg' onClick={onClick}>
          <TbLayoutSidebar size='1.2rem' />
        </ActionIcon>
        <Title size='h3'>Pose Annotator</Title>
        <Group>
          <ActionIcon
            variant='default'
            size='lg'
            disabled={frames.length === 0}
            onClick={onClickDownloadDataUrls}
          >
            {/* <CSVLink data={csvFormat(frames, 'TakayukiTooyama')} filename={'export.csv'}> */}
            <TbFileDownload size='1.2rem' />
            {/* </CSVLink> */}
          </ActionIcon>
          <ActionIcon variant='default' size='lg' onClick={() => toggleColorScheme()}>
            {dark ? <TbSun /> : <TbMoonStars />}
          </ActionIcon>
        </Group>
      </Flex>
    </Header>
  );
};
