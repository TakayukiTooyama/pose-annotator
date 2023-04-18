import { Drawer, Flex, Navbar, ScrollArea, Stack, Text } from '@mantine/core';
import type { FC } from 'react';
import { useState } from 'react';

import { SearchVideo, VideoAddIconButton } from '@/components/Sidebar';
import { VideoListItem } from '@/components/Sidebar/VideoListItem';
import type { Video } from '@/types';

type Props = {
  video: HTMLVideoElement | null;
  showDrawer: boolean;
  videos: Video[];
  selectVideoIndex: number;
  onClose: () => void;
  onAddVideo: (files: File[]) => void;
  onSelectVideo: (index: number, video: HTMLVideoElement | null) => void;
};

export const SidebarDrawer: FC<Props> = ({
  video: videoElement,
  showDrawer,
  videos,
  selectVideoIndex,
  onAddVideo,
  onSelectVideo,
  onClose,
}) => {
  const [searchWord, setSearchWord] = useState('');

  const handleChangeSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.currentTarget.value);
  };

  const filterVideos =
    searchWord === ''
      ? videos
      : videos.filter((video) =>
          video.name.toLowerCase().includes(searchWord.toLowerCase().trim()),
        );

  return (
    <Drawer opened={showDrawer} onClose={onClose}>
      <Navbar>
        <Navbar.Section p='md'>
          <SearchVideo searchWord={searchWord} onChangeSearchWord={handleChangeSearchWord} />
        </Navbar.Section>
        <Navbar.Section grow p='md' component={ScrollArea}>
          <Stack justify='center' spacing={0}>
            <Flex align='center' justify='space-between' pl='sm' mb='sm'>
              <Text color='gray'>VideoList</Text>
              <VideoAddIconButton onAddVideo={onAddVideo} />
            </Flex>
            {filterVideos.map((video, index) => (
              <VideoListItem
                key={video.name}
                video={video}
                active={index === selectVideoIndex}
                onSelectVideo={() => onSelectVideo(index, videoElement)}
              />
            ))}
          </Stack>
        </Navbar.Section>
      </Navbar>
    </Drawer>
  );
};
