import type { FC } from 'react';
import type { PanelResizeHandleProps } from 'react-resizable-panels';
import { PanelResizeHandle as PRHandler } from 'react-resizable-panels';

import { useDarkMode } from '@/hooks';

type Props = PanelResizeHandleProps;

export const PanelResizeHandler: FC<Props> = ({ ...props }) => {
  const { colorScheme } = useDarkMode();
  const dark = colorScheme === 'dark';
  return <PRHandler style={{ backgroundColor: dark ? 'black' : 'white' }} {...props} />;
};
