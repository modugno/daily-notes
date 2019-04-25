import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '@modules/todo/containers/todo/todo.component';
import { TodoRoutingModule } from './todo-routing.module';

import {
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatButtonModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const materialModules = [
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  declarations: [
    TodoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TodoRoutingModule,
    materialModules
  ]
})
export class TodoModule { }
