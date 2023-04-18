import { useCallback, useEffect, useState } from 'react';

type ObjectStore = {
  [key: string]: any;
};

type UseIndexedDBHook = <T extends ObjectStore>(
  dbName: string,
  storeName: string,
  initialValue: T,
) => [T, (newValue: T) => void];

export const useIndexedDB: UseIndexedDBHook = (dbName, storeName, initialValue) => {
  const [value, setValue] = useState<any>(initialValue);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = window.indexedDB.open(dbName, 1);
    request.onsuccess = () => setDb(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'id' });
    };
  }, [dbName, storeName]);

  useEffect(() => {
    if (db) {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get('items');
      request.onsuccess = () => {
        if (request.result) {
          setValue(request.result);
        }
      };
    }
  }, [db, storeName]);

  const setIndexedDBValue = useCallback(
    (newValue: any) => {
      if (db) {
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        objectStore.put({ id: 'items', ...newValue });
      }
      setValue(newValue);
    },
    [db, storeName],
  );

  return [value, setIndexedDBValue];
};
