import type { FC } from 'react';

import type { MarkerOption } from '@/types';

type Props = {
  markers: MarkerOption[];
};

export const MarkerCounter: FC<Props> = ({ markers }) => (
  <div className='h-6'>/{markers.length}</div>
);
