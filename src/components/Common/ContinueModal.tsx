import { Button, Group, List, Modal, Stack } from '@mantine/core';
import type { FC } from 'react';
import { useCallback } from 'react';

import { Text } from '@/components/Common';
import { VideoAddButton } from '@/components/Sidebar';
import type { FrameMarkers, Video, VideoFrames } from '@/types';
import { extractFilename } from '@/utils';

type Props = {
  videos: Video[];
  videoFrames: VideoFrames;
  frameMarkers: FrameMarkers;
  updateVideoFrames: (videoFrames: VideoFrames) => void;
  updateFrameMarkers: (frameMarkers: FrameMarkers) => void;
};

export const ContinueModal: FC<Props> = ({
  videos,
  videoFrames,
  frameMarkers,
  updateFrameMarkers,
  updateVideoFrames,
}) => {
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
    <Modal.Root
      opened={showModal && !completeImport}
      onClose={() => updateLocalStorage(importedVideoNames)}
      size='sm'
      padding='xl'
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title className='text-xl font-bold'>続きから</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <Text text='下記の名前の動画追加することで続きから行うことができます。' />
            <List spacing='xs' listStyleType={'initial'}>
              {videoKeys
                .filter(
                  (videoKey) => !importedVideoNames.some((videoName) => videoName === videoKey),
                )
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
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
