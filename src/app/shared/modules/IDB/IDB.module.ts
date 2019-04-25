import { NgModule, APP_INITIALIZER, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IDBService } from './IDB.service';
import { IDBModel } from './IDB.model';
export const IDBConfigInjection = new InjectionToken<IDBModel>('IDBConfigInjection');

export function registerIDB(config: IDBModel, IDB: IDBService) {
  return () => IDB.initialize(config.database, config.version, config.stores);
}

@NgModule({
  imports: [
    CommonModule
  ]
})
export class IDBModule {

  /**
  * Method to config database
  * @param IDBConfig
  */
  static forRoot(IDBConfig: IDBModel): ModuleWithProviders {
    return {
      ngModule: IDBModule,
      providers: [
        IDBService,
        {
          provide: IDBConfigInjection,
          useValue: IDBConfig
        },
        {
          provide: APP_INITIALIZER,
          useFactory: registerIDB,
          deps: [IDBConfigInjection, IDBService],
          multi: true
        }
      ]
    }
  }
}
