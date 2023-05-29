import type { FC } from 'react';

import { useCalibrationMarker } from '@/store';

export const ActualLengthConversion: FC = () => {
  const { markers, realDimensions } = useCalibrationMarker();

  return <div>ActualLengthConversion</div>;
};
