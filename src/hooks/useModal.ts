import { useState } from 'react';

export const useModal = () => {
  const [modalKey, setModalKey] = useState<string | null>(null);

  const openModal = (key: string) => {
    setModalKey(key);
  };

  const closeModal = (key: string) => {
    if (modalKey === key) {
      setModalKey(null);
    }
  };

  const isModalOpen = (key: string) => modalKey === key;

  return { openModal, closeModal, isModalOpen };
};
