import { useState, useEffect, useCallback } from "react";

export default function useIndexedDB(dbName, storeName) {
  const [db, setDb] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化数据库
  useEffect(() => {
    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        console.log("Object store created successfully.");
      }
    };

    openRequest.onsuccess = (event) => {
      setDb(event.target.result);
      setIsInitialized(true);
      console.log("Database initialized successfully.");
    };

    openRequest.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  }, [dbName, storeName]);

  // 添加数据
  const add = useCallback(
    (data) => {
      return new Promise((resolve, reject) => {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.add(data);

        request.onsuccess = () => {
          console.log("Data added successfully.");
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Failed to add data:", event.target.error);
          reject(event.target.error);
        };
      });
    },
    [db, storeName]
  );

  // 读取数据
  const get = useCallback(
    (id) => {
      return new Promise((resolve, reject) => {
        if (!db) return;
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(id);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Failed to retrieve data:", event.target.error);
          reject(event.target.error);
        };
      });
    },
    [db, storeName]
  );

  // 更新数据
  const update = useCallback(
    (data) => {
      return new Promise((resolve, reject) => {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.put(data);

        request.onsuccess = () => {
          console.log("Data updated successfully.");
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Failed to update data:", event.target.error);
          reject(event.target.error);
        };
      });
    },
    [db, storeName]
  );

  // 删除数据
  const remove = useCallback(
    (id) => {
      return new Promise((resolve, reject) => {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
          console.log("Data deleted successfully.");
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Failed to delete data:", event.target.error);
          reject(event.target.error);
        };
      });
    },
    [db, storeName]
  );

  // 获取所有数据
  const getAll = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!db) return;
      const transaction = db.transaction([storeName], "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Failed to retrieve all data:", event.target.error);
        reject(event.target.error);
      };
    });
  }, [db, storeName]);

  return { isInitialized, add, get, update, remove, getAll };
}
