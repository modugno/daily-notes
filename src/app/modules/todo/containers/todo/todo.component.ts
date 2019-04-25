import { Component, OnInit } from '@angular/core';
import { Todo } from "@modules/todo/shared/models/todo.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDBService } from '@shared/modules/IDB/IDB.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  public todos: Todo[] = [];
  public todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private IDB: IDBService
  ) {}

  ngOnInit() {
    this._setForm();
    this.getTodo();
  }

  private _setForm(): void {
    this.todoForm = this.fb.group({
      title: ['', Validators.required]
    })
  }

  /**
   * Get all todolist
   */
  private getTodo(): void {
    this.IDB.getAll('todo').subscribe((data: Todo[]) => {
      console.log('data', data);
      this.todos = data;
    })
  }

  /**
   * Add todo
   */
  add(): void {
    const todo: Todo = {
      title: this.todoForm.controls['title'].value
    }

    this.todos.push(todo);
    this.todos = [...[], ...this.todos];

    this.IDB.add('todo', todo).subscribe(() => {
      // reset form and errors
      this.todoForm.markAsUntouched();
      this.todoForm.reset();

      Object.keys(this.todoForm.controls).forEach((name: string) => {
        const control = this.todoForm.controls[name];
        control.setErrors(null);
      })
    });
  }

  /**
   * Remote Todo
   * @param index
   */
  remove(todo: Todo, index: number): void {
    this.IDB.delete('todo', todo.id).subscribe(() => this.todos.splice(index, 1))
  }
}
