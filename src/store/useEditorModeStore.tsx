import { create } from 'zustand';

import type { AnnotationMode, ExtractMode, ProcessingMode } from '@/types';

type State = {
  processingMode: ProcessingMode;
  extractMode: ExtractMode;
  annotationMode: AnnotationMode;
};
type Action = {
  selectProcessingMode: (mode: ProcessingMode) => void;
  selectAnnotationMode: (mode: AnnotationMode) => void;
  selectExtractMode: (mode: ExtractMode) => void;
};

export const useEditorModeStore = create<State & Action>()((set) => ({
  processingMode: 'frameExtraction',
  extractMode: 'selectFrame',
  annotationMode: 'allParts',
  selectProcessingMode: (mode) => set({ processingMode: mode }),
  selectAnnotationMode: (mode) => set({ annotationMode: mode }),
  selectExtractMode: (mode) => set({ extractMode: mode }),
}));
