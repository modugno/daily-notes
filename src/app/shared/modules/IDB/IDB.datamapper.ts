import { Subscriber, Observable } from 'rxjs';
import { IDBHelpers } from './IDB.helpers';

export class IDBDataMapper {

  protected connection: IDBDatabase;
  protected helper: IDBHelpers;

  constructor() {
    this.helper = new IDBHelpers;
  }

  /**
  * Save the data on store
  * @param store Store name
  * @param data The data that will be inserted
  */
  add(store: string, data: any): Observable<Event> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readwrite').add(data);
      request.onsuccess = event => observable$.next((<IDBRequest>event.target).result);
      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);
    });
  }

  /**
  * Find and get the data by id
  * @param store Store name
  * @param id Primary Key of data
  */
  find(store: string, id: number): Observable<any> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readwrite').get(id);
      request.onsuccess = event => observable$.next((<IDBRequest>event.target).result);
      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);
    });
  }

  /**
  * Get first item from store
  * @param store Store name
  */
  first(store: string): Observable<Array<any>> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readonly').openCursor();

      request.onsuccess = event => {
        const cursor = (<IDBRequest>event.target).result;
        if (cursor) {
          observable$.next(cursor.value);
        }
      }

      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);

    });
  }

  /**
  * Get all datas from store
  * @param store Store name
  */
  getAll(store: string): Observable<Array<any>> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readonly').openCursor();

      const results = [];

      request.onsuccess = event => {
        const cursor = (<IDBRequest>event.target).result;

        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          observable$.next(results);
        }
      }

      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);

    });
  }

  /**
  * Update the data
  * @param newData Data that will be updated
  */
  update(store: string, data: any): Observable<number> {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readwrite').put(data);
      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);
      request.onsuccess = event => observable$.next((<IDBRequest>event.target).result);
    });
  }

  /**
   * Delete item from store
   * @param id Primary Key
   */
  delete(store: string, id: number) {
    return Observable.create((observable$: Subscriber<any>) => {
      const request = this.helper.getObjectStore(this.connection, store, 'readwrite').delete(id);
      request.onerror = event => observable$.error((<IDBRequest>event.target).error.name);
      request.onsuccess = event => observable$.next((<IDBRequest>event.target).result);

    });
  }
}
