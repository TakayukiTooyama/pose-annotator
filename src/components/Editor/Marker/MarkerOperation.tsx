import type { FC } from 'react';
import { TbAccessible, TbCameraPlus, TbClick, TbEdit, TbViewfinder } from 'react-icons/tb';

import { IconButton } from '@/components/Common';

type Props = {
  labelingMode: string;
  viewMode: string;
  onToggleLabelingMode: () => void;
  onToggleViewMode: () => void;
  onOpenModal: () => void;
};

export const MarkerOperation: FC<Props> = ({
  labelingMode,
  viewMode,
  onToggleLabelingMode,
  onToggleViewMode,
  onOpenModal,
}) => (
  <div className='flex justify-between'>
    <IconButton icon={TbEdit} onClick={onOpenModal} />
    <IconButton
      icon={labelingMode === 'allLabeling' ? TbAccessible : TbViewfinder}
      onClick={onToggleLabelingMode}
    />
    <IconButton
      icon={viewMode === 'frameExtraction' ? TbCameraPlus : TbClick}
      onClick={onToggleViewMode}
    />
  </div>
);
