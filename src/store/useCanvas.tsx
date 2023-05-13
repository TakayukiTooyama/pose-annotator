import { useCanvasStore } from '@/store/useCanvasStore';
import { useFrame } from '@/store/useFrame';

export const useCanvas = () => {
  const canvases = useCanvasStore((state) => state.canvases);
  const createCanvases = useCanvasStore((state) => state.createCanvases);
  const addCanvas = useCanvasStore((state) => state.addCanvas);
  const deleteCanvas = useCanvasStore((state) => state.deleteCanvas);

  const { currentFrameIndex } = useFrame();

  const selectedCanvas = canvases[currentFrameIndex];

  return {
    canvases,
    selectedCanvas,
    createCanvases,
    addCanvas,
    deleteCanvas,
  };
};
