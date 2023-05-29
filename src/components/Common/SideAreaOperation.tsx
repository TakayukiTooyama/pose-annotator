import { TbMoonStars, TbSun } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { DLCTrainingDataFormatter } from '@/components/Header';
import { useDarkMode } from '@/hooks';

export const SideAreaOperation = () => {
  const { colorScheme, toggleColorScheme } = useDarkMode();
  const dark = colorScheme === 'dark';
  return (
    <div className='flex w-full items-center space-x-2 overflow-hidden p-2'>
      <IconButton icon={dark ? TbSun : TbMoonStars} onClick={() => toggleColorScheme()} />
      <DLCTrainingDataFormatter />
    </div>
  );
};
