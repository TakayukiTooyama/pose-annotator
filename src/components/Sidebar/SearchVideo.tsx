import { TextInput } from '@mantine/core';
import type { FC } from 'react';
import { TbSearch } from 'react-icons/tb';

type Props = {
  searchWord: string;
  onChangeSearchWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SearchVideo: FC<Props> = ({ searchWord, onChangeSearchWord }) => (
  <TextInput
    placeholder='検索'
    radius='xl'
    value={searchWord}
    onChange={onChangeSearchWord}
    icon={<TbSearch />}
  />
);
