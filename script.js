"use strict";

class TodoApp {
  constructor() {
    this.inputTextField = document.querySelector(".input-text__field");
    this.sectionOptions = document.querySelector(".section-options");
    this.sectionOptionsMobile = document.querySelector(
      ".option-selection__mobile"
    );
    this.sectionInput = document.querySelector(".section-input");
    this.todoListContainer = document.querySelector(".todo-lists__container");
    this.todoCount = document.querySelector(".todo-count");
    this.container = document.querySelector(".container");
    this.taskCount = 0;
    this.isChanged = false;

    //checkbox button to add a todo
    this.addTaskCheckbox = document.getElementById("add-task__checkbox");
    //buttons for selecting(all,active and completed)
    this.optionSelectAll = document.querySelectorAll(".option-select__all");
    this.optionSelectActive = document.querySelectorAll(
      ".option-select__active"
    );
    this.optionSelectCompleted = document.querySelectorAll(
      ".option-select__completed"
    );
    this.optionClearCompleted = document.querySelector(
      ".option-clear__completed"
    );
    this.lightDarkBtn = document.querySelector(".light-dark__btn");

    // Arrays to hold tasks
    this.allTasks = [];
    console.log(this.allTasks);
    this.activeTasks = [];
    console.log(this.activeTasks);
    this.completedTasks = [];
    console.log(this.completedTasks);

    //methods that is binded
    this.addTask = this.addTask.bind(this);
    this.handleRemoveTask = this.handleRemoveTask.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.handleBackgoundColor = this.handleBackgoundColor.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.darkTheme = this.darkTheme.bind(this);
    this.lightTheme = this.lightTheme.bind(this);
    this.updateTodoListTheme = this.updateTodoListTheme.bind(this);
    this.checkDuplicate = this.checkDuplicate.bind(this);

    // event listeners for adding task
    this.todoListContainer.addEventListener("click", this.handleRemoveTask);
    this.todoListContainer.addEventListener(
      "change",
      this.handleCheckboxChange
    );
    document.addEventListener("keydown", this.handleKeyDown);
    this.lightDarkBtn.addEventListener("click", () => this.changeColor());

    // event listeners for displaying task or filtering task
    this.optionSelectAll.forEach((btn) =>
      btn.addEventListener("click", () => this.displayAllTasks())
    );
    this.optionSelectActive.forEach((btn) =>
      btn.addEventListener("click", () => this.displayActiveTasks())
    );
    this.optionSelectCompleted.forEach((btn) =>
      btn.addEventListener("click", () => this.displayCompletedTasks())
    );
    this.optionClearCompleted.addEventListener("click", () =>
      this.clearCompleted()
    );

    //event listeners for drag and drop
    this.todoListContainer.addEventListener(
      "dragstart",
      this.handleDragStart.bind(this)
    );
    this.todoListContainer.addEventListener(
      "dragover",
      this.handleDragOver.bind(this)
    );
    this.todoListContainer.addEventListener("drop", this.handleDrop.bind(this));

    this.addTaskCheckbox.addEventListener(
      "click",
      this.handleAddTask.bind(this)
    );
  }
  changeColor() {
    this.handleBackgoundColor(this.isChanged, this.lightDarkBtn);
    this.isChanged = !this.isChanged;
    this.updateTodoListTheme();
  }
  handleBackgoundColor(isChangedVariable, iconBtn) {
    if (isChangedVariable) {
      iconBtn.src = "images/icon-sun.svg";
      isChangedVariable = true;
      this.darkTheme();
    } else {
      iconBtn.src = "images/icon-moon.svg";
      isChangedVariable = false;
      this.lightTheme();
    }
  }
  darkTheme() {
    this.container.style.backgroundImage = "url('images/bg-desktop-dark.jpg')";
    this.container.style.backgroundColor = "hsl(235, 21%, 11%)";
    this.sectionInput.style.backgroundColor = "hsl(235, 21%, 11%)";
    this.sectionOptions.style.backgroundColor = "hsl(235, 21%, 11%)";
    this.sectionOptionsMobile.style.backgroundColor = "hsl(235, 21%, 11%)";
  }
  lightTheme() {
    this.container.style.backgroundImage = "url('images/bg-desktop-light.jpg')";
    this.container.style.backgroundColor = "hsl(236, 33%, 92%)";
    this.sectionInput.style.backgroundColor = "hsl(236, 33%, 92%)";
    this.sectionOptions.style.backgroundColor = "hsl(236, 33%, 92%)";
    this.sectionOptionsMobile.style.backgroundColor = "hsl(236, 33%, 92%)";
  }
  updateTodoListTheme() {
    const todoLists = document.querySelectorAll(".todo-list");
    const todoName = document.querySelectorAll(".todo-list__name");
    todoLists.forEach((todo) => {
      if (this.isChanged) {
        todo.style.backgroundColor = "hsl(236, 33%, 92%)";
      } else {
        todo.style.backgroundColor = "hsl(235, 21%, 11%)";
      }
    });
    todoName.forEach((todo) => {
      if (this.isChanged) {
        todo.style.color = "hsl(235, 21%, 11%)";
      } else {
        todo.style.color = "hsl(236, 33%, 92%)";
      }
    });
  }
  addTask() {
    const taskName = this.inputTextField.value.trim();
    if (!taskName) return;
    if (this.checkDuplicate(taskName)) {
      return;
    }

    const task = {
      name: taskName,
      completed: false,
    };

    // Add task to arrays
    this.allTasks.push(task);
    this.activeTasks.push(task);

    const pendingList = `
           <div class="todo-list">
            <input type="checkbox" id="${taskName}" name="${taskName}" />
            <p class="todo-list__name">${taskName}</p>
            <img
              src="images/icon-cross.svg"
              class="todo-list__remove"
              alt="an image of a cross"
            />
          </div>
           `;

    this.todoListContainer.insertAdjacentHTML("beforeend", pendingList);
    this.taskCount++;
    this.updateTaskCount();
    this.inputTextField.value = "";
    this.updateTodoListTheme();
  }
  checkDuplicate(input) {
    const existingTask = this.allTasks.find((task) => task.name === input);
    if (existingTask) {
      this.inputTextField.classList.add("vibrate");

      setTimeout(() => {
        this.inputTextField.classList.remove("vibrate");
      }, 500);

      return true;
    }

    return false;
  }

  //second method
  handleRemoveTask(e) {
    if (e.target.classList.contains("todo-list__remove")) {
      const todoListItem = e.target.parentElement;
      const checkbox = todoListItem.querySelector("input[type='checkbox']");
      const taskName = todoListItem.querySelector(".todo-list__name").innerText;

      // Remove task from all tasks array
      this.allTasks = this.allTasks.filter((task) => task.name !== taskName);

      if (checkbox.checked) {
        this.completedTasks = this.completedTasks.filter(
          (task) => task.name !== taskName
        );
        this.completedTasks.push({ name: taskName, completed: true });
      } else {
        this.activeTasks = this.activeTasks.filter(
          (task) => task.name !== taskName
        );
        this.activeTasks.push({ name: taskName, completed: true });
      }

      // Decrement task count only if the task was checked
      if (!checkbox.checked) {
        this.taskCount--;
      }
      todoListItem.remove();
      this.updateTaskCount();
    }
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.addTask();
    }
  }

  handleAddTask() {
    this.addTask();
  }

  handleCheckboxChange(event) {
    const checkbox = event.target;
    const todoListItem = checkbox.closest(".todo-list");
    const todoListName =
      todoListItem.querySelector(".todo-list__name").innerText;

    // Update the task state based on the checkbox
    if (checkbox.checked) {
      // Move task from active to completed
      this.completedTasks.push({ name: todoListName, completed: true });
      this.activeTasks = this.activeTasks.filter(
        (task) => task.name !== todoListName
      );
      // Add line-through style
      todoListItem
        .querySelector(".todo-list__name")
        .classList.add("line-through");
      this.taskCount--; // Decrement task count
    } else {
      // Move task from completed back to active
      this.completedTasks = this.completedTasks.filter(
        (task) => task.name !== todoListName
      );
      this.activeTasks.push({ name: todoListName, completed: false });
      todoListItem
        .querySelector(".todo-list__name")
        .classList.remove("line-through");
      this.taskCount++;
    }

    this.updateTaskCount();

    this.displayAllTasks();
  }

  updateTaskCount() {
    this.todoCount.innerText = this.taskCount;
  }

  // Method to display all tasks
  displayAllTasks() {
    this.todoListContainer.innerHTML = "";
    // Combined active and completed tasks for display
    const allTasksToDisplay = [...this.activeTasks, ...this.completedTasks];
    allTasksToDisplay.forEach((task) => {
      this.renderTask(task);
    });
    if (this.completedTasks.length < 1) {
      this.completedTasks = [];
    }
  }

  // Method to display only active tasks
  displayActiveTasks() {
    this.todoListContainer.innerHTML = "";
    this.activeTasks.forEach((task) => {
      this.renderTask(task);
    });
  }

  // Method to display only completed tasks
  displayCompletedTasks() {
    this.todoListContainer.innerHTML = "";
    this.completedTasks.forEach((task) => {
      this.renderTask(task);
    });
  }

  // Helper method to render a task
  renderTask(task) {
    const pendingList = `
      <div class="todo-list" draggable="true" data-id="${task.name}">
        <input type="checkbox" id="${task.name}" name="todo" ${
      task.completed ? "checked" : ""
    } />
        <p class="todo-list__name ${task.completed ? "line-through" : ""}">${
      task.name
    }</p>
        <img
          src="images/icon-cross.svg"
          class="todo-list__remove"
          alt="an image of a cross"
        />
      </div>
    `;
    this.todoListContainer.insertAdjacentHTML("beforeend", pendingList);
  }

  clearCompleted() {
    this.allTasks = this.allTasks.filter((task) => !task.completed);
    this.completedTasks = [];

    this.displayActiveTasks();
    this.todoListContainer.innerHTML = "";
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const draggedTaskId = event.dataTransfer.getData("text/plain");
    const droppedOnTaskId = event.target.closest(".todo-list").dataset.id;

    if (draggedTaskId !== droppedOnTaskId) {
      // Find the dragged task and the dropped on task in the allTasks array
      const draggedTaskIndex = this.allTasks.findIndex(
        (task) => task.name === draggedTaskId
      );
      const droppedOnTaskIndex = this.allTasks.findIndex(
        (task) => task.name === droppedOnTaskId
      );

      // Swap the tasks in the array
      const [draggedTask] = this.allTasks.splice(draggedTaskIndex, 1);
      this.allTasks.splice(droppedOnTaskIndex, 0, draggedTask);

      this.renderAllTasks();
    }
  }

  renderAllTasks() {
    this.todoListContainer.innerHTML = "";
    this.allTasks.forEach((task) => {
      this.renderTask(task);
    });
  }
}

const todoApp = new TodoApp();
