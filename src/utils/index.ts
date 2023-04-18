import type { Frame, MarkerOption } from '@/types';

export const generateNewColor = () => {
  const hexColorRep = Array.from({ length: 6 }, () => {
    const randomPosition = Math.floor(Math.random() * 16);
    return '0123456789ABCDEF'[randomPosition];
  });

  return `#${hexColorRep.join('')}`;
};

export const getFillColor = (selectLabel: string, markers: MarkerOption[]) =>
  markers.find((marker) => marker.label === selectLabel)?.color || generateNewColor();

export const byteCount = (s: string): number => new Blob([s]).size;

export const formatBytes = (bytes: number, decimals = 0) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const kb = 1024;

  const findUnitIndex = (bytes: number, index: number): number => {
    if (index >= units.length - 1 || bytes < kb) {
      return index;
    }
    return findUnitIndex(bytes / kb, index + 1);
  };

  const unitIndex = findUnitIndex(bytes, 0);
  const size = bytes / Math.pow(kb, unitIndex);

  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
};

export const removeExtension = (filename: string) =>
  filename.substring(0, filename.lastIndexOf('.'));

export const zeroPad = (num: number) => {
  const str = num.toString();
  return str.padStart(3, '0');
};

export const csvFormat = (frames: Frame[], author: string): string[][] => {
  if (frames.length === 0) {
    return [[]];
  }
  const labels = frames[0].markers.map((marker) => marker.label);
  const rowLength = labels.length;
  const authorArray = new Array(rowLength * 2).fill(author);
  const markerArray = labels.flatMap((label) => [label, label]);
  const xyArray = new Array(rowLength).fill(['x', 'y']).flat();
  const labelData = frames.map((frame) => {
    const markerPositions = Object.values(frame.markers).flatMap((marker) => [
      marker.position?.x ? `${Math.round(Number(marker.position?.x))}` : '',
      marker.position?.y ? `${Math.round(Number(marker.position?.y))}` : '',
    ]);
    return [
      'labeled-data',
      removeExtension(frame.videoName),
      `${frame.name}.jpg`,
      ...markerPositions,
    ];
  });

  return [
    ['scorer', '', '', ...authorArray],
    ['bodyparts', '', '', ...markerArray],
    ['coords', '', '', ...xyArray],
    ...labelData,
  ];
};

export const createVideoElement = (videoUrl: string): HTMLVideoElement => {
  const video = document.createElement('video');
  video.src = videoUrl;
  video.muted = true;
  video.crossOrigin = 'anonymous';
  video.style.display = 'none';
  document.body.appendChild(video);
  return video;
};

export const getFrameUrl = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  frame: Frame,
): Promise<string> =>
  new Promise((resolve) => {
    video.currentTime = Number(frame.name) / 30;
    const handleSeeked = () => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
      video.removeEventListener('seeked', handleSeeked);
    };
    video.addEventListener('seeked', handleSeeked);
  });
