import { Button, Group, List } from '@mantine/core';
import type { FC } from 'react';
import { useCallback } from 'react';

import { Text } from '@/components/Common';
import { FitModal } from '@/components/Common/Modal/FitModal';
import { VideoAddButton } from '@/components/Sidebar';
import { useFrame, useMarker, useVideo } from '@/store';
import { extractFilename } from '@/utils';

export const ContinueModal: FC = () => {
  const { videos } = useVideo();
  const { updateVideoFrames, videoFrames } = useFrame();
  const { updateFrameMarkers, frameMarkers } = useMarker();

  const videoKeys = Object.keys(videoFrames);
  const importedVideoNames = videos
    .filter((video) => videoKeys.includes(video.name))
    .map((video) => video.name);
  const completeImport = importedVideoNames.length === videoKeys.length;
  const showModal = videoKeys.some((key) => !videos.map((video) => video.name).includes(key));

  const updateLocalStorage = useCallback(
    (selectedVideoNames: string[]) => {
      const newVideoFrames = Object.fromEntries(
        Object.entries(videoFrames).filter(([key]) =>
          selectedVideoNames.includes(extractFilename(key)),
        ),
      );
      const newFrameMarkers = Object.fromEntries(
        Object.entries(frameMarkers).filter(([key]) =>
          selectedVideoNames.includes(extractFilename(key)),
        ),
      );
      updateVideoFrames(newVideoFrames);
      updateFrameMarkers(newFrameMarkers);
    },
    [frameMarkers, videoFrames, updateFrameMarkers, updateVideoFrames],
  );

  return (
    <FitModal
      title='続きから始める'
      showModal={showModal && !completeImport}
      onClose={() => updateLocalStorage(importedVideoNames)}
    >
      <Text text='下記の名前の動画追加することで続きから行うことができます。' />
      <List spacing='xs' listStyleType={'initial'}>
        {videoKeys
          .filter((videoKey) => !importedVideoNames.some((videoName) => videoName === videoKey))
          .map((videoFrame) => (
            <List.Item key={videoFrame} className='text-red-500'>
              {videoFrame}
            </List.Item>
          ))}
      </List>
      <Group grow>
        <VideoAddButton />
        {importedVideoNames.length > 0 ? (
          <Button onClick={() => updateLocalStorage(importedVideoNames)} color='gray'>
            始める
          </Button>
        ) : (
          <Button onClick={() => updateLocalStorage(importedVideoNames)} color='red'>
            最初から
          </Button>
        )}
      </Group>
    </FitModal>
  );
};
