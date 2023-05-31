import { Flex, ScrollArea, Stack } from '@mantine/core';
import type { FC } from 'react';

import { Label } from '@/components/Common';
import { SearchVideo, VideoAddButton, VideoList } from '@/components/Sidebar';
import { useVideoListFilter } from '@/hooks';
import { useVideo } from '@/store';

export const PlayerEditor: FC = () => {
  const { videos, currentVideoIndex } = useVideo();
  const { filterVideos, searchWord, handleChangeSearchWord } = useVideoListFilter(videos);

  return (
    <div className='space-y-4 overflow-hidden'>
      <SearchVideo searchWord={searchWord} onChangeSearchWord={handleChangeSearchWord} />
      <Stack justify='center' spacing={0}>
        <Flex align='center' justify='space-between' pl='sm' mb='sm'>
          <Label label='VideoList' />
          <VideoAddButton />
        </Flex>
        <ScrollArea.Autosize style={{ maxHeight: 'calc(100vh - 370px)' }}>
          <VideoList videos={filterVideos} selectedIndex={currentVideoIndex} />
        </ScrollArea.Autosize>
      </Stack>
    </div>
  );
};
