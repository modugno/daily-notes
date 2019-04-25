export interface IDBModel {
  database: string;
  version: number;
  stores: Array<string>;
}
