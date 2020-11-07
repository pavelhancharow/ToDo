'use strict';

class ToDo {
  constructor(form, input, todoList, todoCompleted, container) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.container = document.querySelector(container);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoCompleted.textContent = '';
    this.todoList.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
          <button class="todo-edit"></button>
          <button class="todo-remove"></button>
          <button class="todo-complete"></button>
        </div>
    `);
    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();

    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      console.log([...this.todoData]);
      this.input.value = '';
      this.render();
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15);
  }

  deleteItem(li) {
    this.todoData.forEach((item, i, arr) => {
      if (item.key === li.key) {
        li.remove(li);
        arr.delete(i);
      }
      this.render();
    });

  }

  completedItem(li) {
    this.todoData.forEach((item) => {
      if (item.key === li.key) {
        item.completed = !item.completed;
      }

      this.render();
    });
  }

  // editItem(li) {
  //   this.todoData.forEach((item) => {
  //     if (item.key === li.key) {
  //       // li..contenteditable = true;
  //       // let span = li.querySelector('.text-todo');
  //       li.contentEditable = true;
  //       li.addEventListener('input', () => {
  //         item.value = `${li.value}`;
  //         console.dir(item);

  //       });
  //     }
  //     // this.render();
  //   });

  //   // console.log('edit');
  // }

  handler() {
    this.container.addEventListener('click', (e) => {
      let target = e.target;
      if (target.matches('.todo-edit')) {
        this.editItem(target.closest('.todo-item'));
      } else if (target.matches('.todo-remove')) {
        this.deleteItem(target.closest('.todo-item'));
      } else if (target.matches('.todo-complete')) {
        this.completedItem(target.closest('.todo-item'));
      }
    });
  }

  init() {
    this.input.required = true;
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();