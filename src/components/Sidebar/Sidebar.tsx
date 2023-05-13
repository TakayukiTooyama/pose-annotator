import { Drawer, Flex, Navbar, ScrollArea, Stack } from '@mantine/core';
import type { FC, SetStateAction } from 'react';

import { Text } from '@/components/Common';
import { SearchVideo, VideoAddButton, VideoList } from '@/components/Sidebar';
import { useVideoListFilter } from '@/hooks/useVideoListFilter';
import { useVideo } from '@/store';

type Props = {
  showDrawer: boolean;
  onCloseSidebar: () => void;
  toggleViewMode: (value?: SetStateAction<string> | undefined) => void;
};

export const Sidebar: FC<Props> = ({ showDrawer, onCloseSidebar, toggleViewMode }) => {
  const { videos, currentVideoIndex } = useVideo();
  const { filterVideos, searchWord, handleChangeSearchWord } = useVideoListFilter(videos);

  return (
    <Drawer opened={showDrawer} onClose={onCloseSidebar}>
      <Navbar>
        <Navbar.Section p='md'>
          <SearchVideo searchWord={searchWord} onChangeSearchWord={handleChangeSearchWord} />
        </Navbar.Section>
        <Navbar.Section grow p='md' component={ScrollArea}>
          <Stack justify='center' spacing={0}>
            <Flex align='center' justify='space-between' pl='sm' mb='sm'>
              <Text text='VideoList' />
              <VideoAddButton />
            </Flex>
            <VideoList
              videos={filterVideos}
              selectedIndex={currentVideoIndex}
              toggleViewMode={toggleViewMode}
            />
          </Stack>
        </Navbar.Section>
      </Navbar>
    </Drawer>
  );
};
