import { Drawer, Flex, Navbar, ScrollArea, Stack, Text } from '@mantine/core';
import type { FC, RefObject } from 'react';
import { useState } from 'react';

import { SearchVideo, VideoAddIconButton } from '@/components/Sidebar';
import { VideoListItem } from '@/components/Sidebar/VideoListItem';
import type { Video } from '@/types';

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  showDrawer: boolean;
  videos: Video[];
  currentVideoIndex: number;
  onClose: () => void;
  onAddVideo: (files: File[]) => void;
  onSelectVideo: (index: number, video: HTMLVideoElement | null) => void;
};

export const SidebarDrawer: FC<Props> = ({
  videoRef,
  showDrawer,
  videos,
  currentVideoIndex,
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
              <Text
                sx={(theme) => ({
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
                })}
              >
                VideoList
              </Text>
              <VideoAddIconButton onAddVideo={onAddVideo} />
            </Flex>
            {filterVideos.map((video, index) => (
              <VideoListItem
                key={video.name}
                video={video}
                active={index === currentVideoIndex}
                onSelectVideo={() => onSelectVideo(index, videoRef.current)}
              />
            ))}
          </Stack>
        </Navbar.Section>
      </Navbar>
    </Drawer>
  );
};
