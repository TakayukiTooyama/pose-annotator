import { Button, Group, List, Modal, Stack, Text } from '@mantine/core';
import type { FC } from 'react';

import { VideoAddButton } from '@/components/Sidebar';
import type { Video, VideoFrames } from '@/types';

type Props = {
  videos: Video[];
  videoFrames: VideoFrames;
  showModal: boolean;
  onDeleteVideoFrames: () => void;
  onAddVideo: (payload: File[]) => void;
};
export const ContinueModal: FC<Props> = ({
  videos,
  videoFrames,
  showModal,
  onAddVideo,
  onDeleteVideoFrames,
}) => {
  const videoKeys = Object.keys(videoFrames);
  const importedVideo = videos.filter((video) => videoKeys.includes(video.name));
  const completeImport = importedVideo.length === videoKeys.length;

  return (
    <Modal.Root
      opened={showModal && !completeImport}
      onClose={onDeleteVideoFrames}
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
            <Text>下記の名前の動画追加することで続きから行うことができます。</Text>
            <List spacing='xs' listStyleType={'initial'}>
              {videoKeys
                .filter((videoKey) => !importedVideo.some((video) => video.name === videoKey))
                .map((videoFrame) => (
                  <List.Item key={videoFrame} className='text-red-500'>
                    {videoFrame}
                  </List.Item>
                ))}
            </List>
            <Group grow>
              <VideoAddButton onAddVideo={onAddVideo} fullWidth />
              {importedVideo.length > 0 ? (
                <Button onClick={onDeleteVideoFrames} color='gray'>
                  始める
                </Button>
              ) : (
                <Button onClick={onDeleteVideoFrames} color='red'>
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
