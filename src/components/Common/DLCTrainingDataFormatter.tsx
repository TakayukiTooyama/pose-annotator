import { Modal, Progress } from '@mantine/core';
import type { FC } from 'react';
import { useMemo } from 'react';
import { TbFileDownload } from 'react-icons/tb';

import { IconButton } from '@/components/Common';
import { useDLCFormat } from '@/hooks';

/* DeepLabCutのトレーニングデータに使用できるフォーマットに変換し、ダウンロードできるボタン */
export const DLCTrainingDataFormatter: FC = () => {
  const { frameMarkers, progress, isDownload, downloadFormatData } =
    useDLCFormat('TakayukiTooyama');

  const disabled = useMemo(
    () =>
      frameMarkers &&
      Object.values(frameMarkers).every((markers) =>
        markers.every((marker) => marker.position === null),
      ),
    [frameMarkers],
  );

  return (
    <>
      <IconButton disabled={disabled} icon={TbFileDownload} onClick={downloadFormatData} />
      <Modal opened={isDownload} onClose={() => false} withCloseButton={false}>
        <Progress value={progress} animate />
      </Modal>
    </>
  );
};
