import { useState } from 'react';

export const useMultiToggle = () => {
  const [toggleStates, setToggleStates] = useState<Map<string, boolean>>(new Map());

  const open = (key: string) => {
    setToggleStates((prevStates) => new Map(prevStates).set(key, true));
  };

  const close = (key: string) => {
    setToggleStates((prevStates) => new Map(prevStates).set(key, false));
  };

  const toggle = (key: string) => {
    setToggleStates((prevStates) => {
      const currentState = prevStates.get(key) || false;
      return new Map(prevStates).set(key, !currentState);
    });
  };

  const isOpen = (key: string) => toggleStates.get(key) || false;

  return { open, close, toggle, isOpen };
};
