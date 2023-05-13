import type { FC, SetStateAction } from 'react';
import { TbSquareMinus } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { VideoListItem } from '@/components/Sidebar/VideoListItem';
import { useVideo } from '@/store';
import type { Video } from '@/types';

type Props = {
  videos: Video[];
  selectedIndex: number;
  toggleViewMode: (value?: SetStateAction<string> | undefined) => void;
};

export const VideoList: FC<Props> = ({ videos, selectedIndex, toggleViewMode }) => {
  const { deleteVideo, selectVideoIndex } = useVideo();

  const handleSelectVideo = (index: number) => {
    selectVideoIndex(index);
    toggleViewMode('frameExtraction');
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
