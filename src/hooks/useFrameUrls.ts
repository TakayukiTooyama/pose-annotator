import { useEffect, useState } from 'react';

export const useFrameUrls = (src: string, times: number[]) => {
  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [isCreatingFrameUrls, setIsCreatingFrameUrls] = useState(false);

  useEffect(() => {
    const createVideoElement = (): HTMLVideoElement => {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.style.display = 'none';
      document.body.appendChild(video);
      return video;
    };

    const video = createVideoElement();
    const canvas = document.createElement('canvas');

    const getFrameUrl = (video: HTMLVideoElement, time: number): Promise<string> =>
      new Promise((resolve) => {
        video.currentTime = time;
        const handleSeeked = () => {
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
          video.removeEventListener('seeked', handleSeeked);
        };
        video.addEventListener('seeked', handleSeeked);
      });

    const loadedmetadataHandler = async () => {
      setIsCreatingFrameUrls(true);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const newFrameUrls: string[] = [];
      for (const time of times) {
        const newFrameUrl = await getFrameUrl(video, time);
        newFrameUrls.push(newFrameUrl);
      }
      setFrameUrls(newFrameUrls);
      setIsCreatingFrameUrls(false);
    };

    video.addEventListener('loadedmetadata', loadedmetadataHandler);

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', loadedmetadataHandler);
      document.body.removeChild(video);
    };

    return cleanup;
  }, [src, times]);

  return { frameUrls, setFrameUrls, isCreatingFrameUrls };
};

// import { useEffect, useState } from 'react';

// export const useFrameUrls = (src: string, times: number[]) => {
//   const [frameUrls, setFrameUrls] = useState<Blob[]>([]);
//   const [isCreatingFrameUrls, setIsCreatingFrameUrls] = useState(false);

//   useEffect(() => {
//     const createVideoElement = (): HTMLVideoElement => {
//       const video = document.createElement('video');
//       video.src = src;
//       video.muted = true;
//       video.crossOrigin = 'anonymous';
//       video.style.display = 'none';
//       document.body.appendChild(video);
//       return video;
//     };

//     const video = createVideoElement();
//     const canvas = document.createElement('canvas');

//     const getFrame = (video: HTMLVideoElement, time: number): Promise<Blob> =>
//       new Promise((resolve) => {
//         video.currentTime = time;
//         const handleSeeked = () => {
//           const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//           ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//           canvas.toBlob((blob) => {
//             resolve(blob!);
//             video.removeEventListener('seeked', handleSeeked);
//           });
//         };
//         video.addEventListener('seeked', handleSeeked);
//       });

//     const processFrames = async (times: number[]): Promise<Blob[]> => {
//       const newFrames: Blob[] = [];
//       for (const time of times) {
//         const frame = await getFrame(video, time);
//         newFrames.push(frame);
//       }
//       return newFrames;
//     };

//     const loadedmetadataHandler = async () => {
//       setIsCreatingFrameUrls(true);
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const batchSize = 10;
//       let newFrames: Blob[] = [];
//       for (let i = 0; i < times.length; i += batchSize) {
//         const batch = times.slice(i, i + batchSize);
//         const batchFrames = await processFrames(batch);
//         newFrames = [...newFrames, ...batchFrames];
//       }

//       setFrameUrls(newFrames);
//       setIsCreatingFrameUrls(false);
//     };

//     video.addEventListener('loadedmetadata', loadedmetadataHandler);

//     const cleanup = () => {
//       video.removeEventListener('loadedmetadata', loadedmetadataHandler);
//       document.body.removeChild(video);
//     };

//     return cleanup;
//   }, [src, times]);

//   return { frameUrls, isCreatingFrameUrls };
// };
