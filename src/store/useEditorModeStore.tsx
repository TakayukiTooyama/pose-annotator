import { create } from 'zustand';

import type { AnnotationMode, CalibrationMode, ExtractMode, ProcessingMode } from '@/types';

type State = {
  processingMode: ProcessingMode;
  extractMode: ExtractMode;
  annotationMode: AnnotationMode;
  calibrationMode: CalibrationMode;
};
type Action = {
  selectProcessingMode: (mode: ProcessingMode) => void;
  selectAnnotationMode: (mode: AnnotationMode) => void;
  selectCalibrationMode: (mode: CalibrationMode) => void;
  selectExtractMode: (mode: ExtractMode) => void;
};

export const useEditorModeStore = create<State & Action>()((set) => ({
  processingMode: 'frameExtraction',
  extractMode: 'selectFrame',
  annotationMode: 'manualAllParts',
  calibrationMode: 'static',
  selectProcessingMode: (mode) => set({ processingMode: mode }),
  selectAnnotationMode: (mode) => set({ annotationMode: mode }),
  selectCalibrationMode: (mode) => set({ calibrationMode: mode }),
  selectExtractMode: (mode) => set({ extractMode: mode }),
}));
