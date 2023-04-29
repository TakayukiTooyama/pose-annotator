import type { Frame, FrameMarkers, MarkerOption } from '@/types';

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

export const extractFilename = (id: string) => id.replace(/-\d+$/, '');

export const extractFrameNumber = (id: string): number => {
  const frameNumber = id.replace(/.*-(\d+)$/, '$1');
  return parseInt(frameNumber, 10);
};

export const zeroPad = (num: number) => {
  const str = num.toString();
  return str.padStart(3, '0');
};

export const logLocalStorageCapacity = () =>
  Object.keys(localStorage).reduce((acc, key) => {
    if (!localStorage.hasOwnProperty(key)) {
      return acc;
    }
    return acc + (localStorage[key].length + key.length) * 2;
  }, 0);

/* 初回と動画に変更があった時に使用 */
export const createCanvasFromVideo = (videoElement: HTMLVideoElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(videoElement, 0, 0);
  }

  return canvas;
};

export const extractFrame = async (video: HTMLVideoElement, time: number) => {
  video.currentTime = time;
  await new Promise((resolve) => {
    video.addEventListener('seeked', resolve, { once: true });
  });

  return createCanvasFromVideo(video);
};

/* CSVで出力する時に使用 */
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

export const createFrameUrls = async (videoFile: File, frames: Frame[]) => {
  const url = URL.createObjectURL(videoFile);
  const newFrameUrls: string[] = [];

  const video = createVideoElement(url);
  const canvas = document.createElement('canvas');

  const loadedmetadataHandler = async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    for (const frame of frames) {
      const newFrameUrl = await getFrameUrl(video, canvas, frame);
      newFrameUrls.push(newFrameUrl);
    }
  };

  const cleanup = () => {
    video.removeEventListener('loadedmetadata', loadedmetadataHandler);
    document.body.removeChild(video);
  };

  return new Promise<string[]>((resolve) => {
    video.load();
    video.onloadeddata = async () => {
      await video.play();
      await loadedmetadataHandler();
      cleanup();
      resolve(newFrameUrls);
    };
  });
};

export const csvFormat = (
  frames: Frame[],
  frameMarkers: FrameMarkers,
  author: string,
): string[][] => {
  if (frames.length === 0) {
    return [[]];
  }

  const videoName = frames[0].videoName;
  const markers = Object.entries(frameMarkers).filter(
    ([key]) => videoName === extractFilename(key),
  );

  if (markers.length === 0) {
    return [[]];
  }

  const labels = markers[0][1].map((marker) => marker.label);
  const rowLength = labels.length;
  const markerArray = labels.flatMap((label) => [label, label]);
  const authorArray = Array.from({ length: rowLength * 2 }, () => author);
  const xyArray = Array.from({ length: rowLength }, () => ['x', 'y']).flat();

  const labelData = markers.map(([key, value]) => {
    const markerPositions = value.flatMap((marker) => [
      marker.position?.x ? `${Math.round(Number(marker.position.x))}` : '',
      marker.position?.y ? `${Math.round(Number(marker.position.y))}` : '',
    ]);

    return [
      'labeled-data',
      removeExtension(videoName),
      `img${zeroPad(extractFrameNumber(key))}.jpg`,
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
