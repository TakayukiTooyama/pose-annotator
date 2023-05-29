import { useEditorModeStore } from '@/store';

export const useEditorMode = () => {
  const processingMode = useEditorModeStore((state) => state.processingMode);
  const extractMode = useEditorModeStore((state) => state.extractMode);
  const annotationMode = useEditorModeStore((state) => state.annotationMode);
  const calibrationMode = useEditorModeStore((state) => state.calibrationMode);
  const selectProcessingMode = useEditorModeStore((state) => state.selectProcessingMode);
  const selectAnnotationMode = useEditorModeStore((state) => state.selectAnnotationMode);
  const selectCalibrationMode = useEditorModeStore((state) => state.selectCalibrationMode);
  const selectExtractMode = useEditorModeStore((state) => state.selectExtractMode);

  return {
    processingMode,
    extractMode,
    annotationMode,
    calibrationMode,
    selectProcessingMode,
    selectAnnotationMode,
    selectCalibrationMode,
    selectExtractMode,
  };
};
