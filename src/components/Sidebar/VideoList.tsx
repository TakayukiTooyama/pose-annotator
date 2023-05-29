import type { FC } from 'react';
import { TbSquareMinus } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { VideoListItem } from '@/components/Sidebar/VideoListItem';
import { useEditorMode, useVideo } from '@/store';
import type { Video } from '@/types';

type Props = {
  videos: Video[];
  selectedIndex: number;
};

export const VideoList: FC<Props> = ({ videos, selectedIndex }) => {
  const { deleteVideo, selectVideoIndex } = useVideo();
  const { selectProcessingMode } = useEditorMode();

  const handleSelectVideo = (index: number) => {
    selectVideoIndex(index);
    selectProcessingMode('frameExtraction');
  };

  return (
    <>
      {videos.map((video, index) => (
        <div key={video.name} className='flex w-full items-center justify-between space-x-4'>
          <VideoListItem
            video={video}
            active={index === selectedIndex}
            onSelectVideo={() => handleSelectVideo(index)}
          />

          <IconButton
            icon={TbSquareMinus}
            variant='light'
            color='red'
            onClick={() => deleteVideo(index)}
          />
        </div>
      ))}
    </>
  );
};
