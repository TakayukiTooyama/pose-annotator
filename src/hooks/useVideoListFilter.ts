import { useMemo, useState } from 'react';

import type { Video } from '@/types';

export const useVideoListFilter = (videos: Video[]) => {
  const [searchWord, setSearchWord] = useState('');

  const handleChangeSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const filterVideos = useMemo(
    () =>
      searchWord === ''
        ? videos
        : videos.filter((video) =>
            video.name.toLowerCase().includes(searchWord.toLowerCase().trim()),
          ),
    [searchWord, videos],
  );

  return {
    filterVideos,
    searchWord,
    handleChangeSearchWord,
  };
};
