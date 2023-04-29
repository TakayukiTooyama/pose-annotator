import type { FC } from 'react';

import type { MarkerOption } from '@/types';

type Props = {
  markerOptions: MarkerOption[];
};

export const MarkerCounter: FC<Props> = ({ markerOptions }) => (
  <div className='h-6'>/{markerOptions.length}</div>
);
