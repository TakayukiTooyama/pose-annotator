import { rem, TextInput } from '@mantine/core';
import type { FC } from 'react';
import { useState } from 'react';

import { useFrame } from '@/store';

export const FrameCounter: FC = () => {
  const { frames, currentFrameIndex, moveFrameIndex } = useFrame();

  const [frameCount, setFrameCount] = useState(currentFrameIndex);
  const [showInput, setShowInput] = useState(false);

  const handleClickTextInput = () => {
    setFrameCount(currentFrameIndex);
    setShowInput(true);
  };

  const handleChangeFrameCount = (e: React.FormEvent<HTMLInputElement>) => {
    const inputFrameIndex = e.currentTarget.value;
    if (Number(inputFrameIndex) > frames.length - 1 || !/^[\d\s]*$/.test(inputFrameIndex)) {
      return;
    }
    setFrameCount(Number(inputFrameIndex));
  };

  const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      moveFrameIndex(frameCount);
      setShowInput(false);
    }
  };

  return (
    <>
      {showInput ? (
        <TextInput
          value={frameCount}
          onChange={handleChangeFrameCount}
          onKeyDown={handleKeyDownEnter}
          onBlur={() => setShowInput(false)}
          step={1}
          styles={{
            input: {
              marginRight: rem(8),
              width: rem(52),
              textAlign: 'center',
            },
          }}
        />
      ) : (
        <TextInput
          readOnly
          value={currentFrameIndex}
          onClick={handleClickTextInput}
          styles={{
            input: {
              marginRight: rem(8),
              width: rem(52),
              textAlign: 'center',
            },
          }}
        />
      )}
    </>
  );
};
