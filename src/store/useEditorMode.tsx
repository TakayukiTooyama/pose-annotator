import { useEditorModeStore } from '@/store';

export const useEditorMode = () => {
  const processingMode = useEditorModeStore((state) => state.processingMode);
  const extractMode = useEditorModeStore((state) => state.extractMode);
  const annotationMode = useEditorModeStore((state) => state.annotationMode);
  const selectProcessingMode = useEditorModeStore((state) => state.selectProcessingMode);
  const selectAnnotationMode = useEditorModeStore((state) => state.selectAnnotationMode);
  const selectExtractMode = useEditorModeStore((state) => state.selectExtractMode);

  return {
    processingMode,
    extractMode,
    annotationMode,
    selectProcessingMode,
    selectAnnotationMode,
    selectExtractMode,
  };
};
