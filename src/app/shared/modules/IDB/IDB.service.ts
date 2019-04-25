import { Injectable } from '@angular/core';
import { Subscriber, Observable } from 'rxjs';
import { IDBDataMapper } from './IDB.datamapper';
import { IDBModel } from './IDB.model';

@Injectable()
export class IDBService extends IDBDataMapper {

  private config: IDBModel;
  private indexedDB: any;

  constructor() {
    super();
  }

  /**
  * Initialize the IndexedDB Service
  * @param database
  * @param version
  * @param stores
  */
  initialize(database: string, version: number, stores: Array<string>): Promise<object> {

    this.indexedDB = (<any>window).indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
    if (!this.browserSupportIndexed()) {
      return;
    }

    this.config = { database, version, stores };

    return new Promise((resolve, reject) => {

      this.open().subscribe(connection => {
        if (!this.connection) {
          this.connection = connection;
        }

        resolve(this.connection);
      }, error => reject(error));
    });
  }

  /**
   * Check if browser support indexedDB
   */
  browserSupportIndexed(): boolean {
    return !!this.indexedDB;
  }


  /**
  * Open the connection with IndexedDB
  */
  open(): Observable<IDBDatabase> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.indexedDB.open(this.config.database, this.config.version);

      request.onerror = err => {
        observable$.error('An error occurred in communication with the database.');
      };

      request.onupgradeneeded = event => {
        this.config.stores.forEach(store => this.helper.createStore((<IDBOpenDBRequest>event.target).result, store));
        observable$.next((<IDBOpenDBRequest>event.target).result);
      };

      request.onsuccess = event => {
        observable$.next((<IDBOpenDBRequest>event.target).result);
      };

    });
  }

  /**
  * Close the IndexedDB connection
  */
  closeConnection(): void {
    this.connection.close();
  }

  /**
   * Clear Store of Database
   * @param store
   */
  clearStore(store: string): Observable<any> {
    return Observable.create((observable$: Subscriber<any>) => {
      const objectStore = this.helper.getObjectStore(this.connection, store, 'readwrite').clear();
      objectStore.onsuccess = event => observable$.next((<IDBRequest>event.target).result);
      objectStore.onerror = error => observable$.error((<IDBRequest>event.target).error.name);
    });
  }

  /**
   * Clear all stores of Database
   */
  clearAllStores(): Observable<any> {
    return Observable.create((observable$: Subscriber<any>) => {
      const stores = Array.from(this.connection.objectStoreNames);
      stores.forEach(store => {
        const objectStore = this.helper.getObjectStore(this.connection, store, 'readwrite').clear();
        objectStore.onsuccess = event => observable$.next((<IDBRequest>event.target).result);
        objectStore.onerror = error => observable$.error((<IDBRequest>event.target).error.name);
      });
    });
  }

}
