import { Component, OnInit } from '@angular/core';
import { Todo } from "@modules/todo/shared/models/todo.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  public todos: Todo[] = [];
  public todo: Todo;
  public todoForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this._setForm();
  }

  private _setForm(): void {
    this.todoForm = this.fb.group({
      title: ['', Validators.required]
    })
  }

  add(): void {
    const todo: Todo = {
      title: this.todoForm.controls['title'].value
    }

    this.todos.push(todo);
    this.todos = [...[], ...this.todos];
    this.todoForm.markAsUntouched();
    this.todoForm.reset();

    Object.keys(this.todoForm.controls).forEach((name: string) => {
      const control = this.todoForm.controls[name];
      control.setErrors(null);
    })
  }

  remove(index: number): void {
    this.todos.splice(index, 1);
  }
}
