import { Divider, Navbar, ScrollArea, Stack } from '@mantine/core';
import type { FC } from 'react';

import { SidebarButton, VideoAddIconButton } from '@/components/Sidebar';
import type { Video } from '@/types';

type Props = {
  videos: Video[];
  currentVideoIndex: number;
  onAddVideo: (payload: File[]) => void;
  onClickVideoLink: (index: number, video: Video) => void;
};

export const SidebarMinimal: FC<Props> = ({
  videos,
  currentVideoIndex,
  onAddVideo,
  onClickVideoLink,
}) => (
  <Navbar width={{ base: 60 }}>
    <Navbar.Section grow p='xs' component={ScrollArea}>
      <VideoAddIconButton onAddVideo={onAddVideo} />
      <Divider my={8} />
      <Stack justify='center' spacing={0}>
        {videos.map((video, index) => (
          <SidebarButton
            key={video.name}
            index={`${index + 1}`}
            label={video.name}
            active={index === currentVideoIndex}
            onClick={() => onClickVideoLink(index, video)}
          />
        ))}
      </Stack>
    </Navbar.Section>
  </Navbar>
);
