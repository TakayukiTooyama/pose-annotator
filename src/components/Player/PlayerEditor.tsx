import { Flex, ScrollArea, Stack } from '@mantine/core';
import type { FC } from 'react';

import { Label, Select } from '@/components/Common';
import { SearchVideo, VideoAddButton, VideoList } from '@/components/Sidebar';
import { useVideoListFilter } from '@/hooks';
import { useEditorMode, useVideo } from '@/store';
import type { ExtractMode } from '@/types';

export const PlayerEditor: FC = () => {
  const { videos, currentVideoIndex } = useVideo();
  const { filterVideos, searchWord, handleChangeSearchWord } = useVideoListFilter(videos);
  const { extractMode, selectExtractMode } = useEditorMode();

  return (
    <div className='space-y-4 overflow-hidden p-2'>
      <Select
        value={extractMode}
        width='100%'
        data={[
          { value: 'selectFrame', label: 'Select Frame' },
          { value: 'allFrames', label: 'All Frames' },
        ]}
        onChange={(value) => selectExtractMode(value as ExtractMode)}
      />
      <SearchVideo searchWord={searchWord} onChangeSearchWord={handleChangeSearchWord} />
      <Stack justify='center' spacing={0}>
        <Flex align='center' justify='space-between' pl='sm' mb='sm'>
          <Label label='VideoList' />
          <VideoAddButton />
        </Flex>
        <ScrollArea.Autosize style={{ maxHeight: 'calc(100vh - 128px)' }}>
          <VideoList videos={filterVideos} selectedIndex={currentVideoIndex} />
        </ScrollArea.Autosize>
      </Stack>
    </div>
  );
};
