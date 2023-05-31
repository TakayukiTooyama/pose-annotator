import cv from '@techstark/opencv-js';
import { useEffect, useState } from 'react';

export const useOpenCV = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cv.onRuntimeInitialized = () => {
      setLoaded(true);
    };
  }, []);

  return { cv, loaded };
};
