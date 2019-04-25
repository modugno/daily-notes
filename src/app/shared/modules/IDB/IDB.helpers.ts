export class IDBHelpers {
  /**
  * Create the store
  * @param connection The connection with IndexedDB
  * @param storeName The name of the store that will be created
  */
  createStore(connection: IDBDatabase, storeName: string): void {
    if (connection.objectStoreNames.contains(storeName)) {
      connection.deleteObjectStore(storeName);
    }

    connection.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
  }

  /**
   * Get the object store
   * @param connection The connection with IndexedDB
   * @param store
   * @param mode
   */
  getObjectStore(connection: IDBDatabase, store: string, mode: IDBTransactionMode) {
    return connection.transaction([store], mode).objectStore(store);
  }
}
