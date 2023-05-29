import { useCallback, useState } from 'react';

import type { MarkerOption } from '@/types';

export const useCreateMarkerLabel = (
  options: MarkerOption[],
  createMarkerOption: (newLabel: string) => void,
) => {
  const [newLabel, setNewLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangeLabel = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const inputLabel = e.currentTarget.value;
    if (/[^a-zA-Z0-9\-_]/g.test(inputLabel)) {
      setErrorMessage('英数字 -(ハイフン) _（アンダースコア）のみ使用できます。');
    } else {
      setErrorMessage('');
    }
    setNewLabel(inputLabel);
  }, []);

  const validateLabel = (label: string) => {
    if (label === '') {
      setErrorMessage('文字列を入力してください。');
      return false;
    }
    if (options.some((marker) => marker.label === label)) {
      setErrorMessage('同じラベルが存在します');
      return false;
    }
    return true;
  };

  const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputLabel = e.currentTarget.value;
      e.preventDefault();

      if (errorMessage || !validateLabel(inputLabel)) {
        return;
      }

      createMarkerOption(inputLabel);
      setNewLabel('');
      setErrorMessage('');
    }
  };

  return {
    newLabel,
    errorMessage,
    handleKeyDownEnter,
    handleChangeLabel,
  };
};
