import type { FC } from 'react';

type Props = {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  url: string;
  width: number;
  height: number;
};
export const PlayerView: FC<Props> = ({ url, videoRef, width, height }) => (
  <video
    ref={videoRef}
    src={url}
    controls
    muted
    width={width}
    height={height}
    className='absolute'
  />
);
