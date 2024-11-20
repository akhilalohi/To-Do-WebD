// Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", manageTask);
filterOption.addEventListener("click", filterTodo);

// Functions

function addTodo(e) {
  e.preventDefault();
  if (todoInput.value.trim() === "") return;

  // Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // Create list item
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // Add to localStorage
  saveLocalTodos(todoInput.value);

  // Create Edit Button
  const editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fas fa-edit"></i>`;
  editButton.classList.add("edit-btn");
  todoDiv.appendChild(editButton);

  // Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  // Create Trash Button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  // Append to list
  todoList.appendChild(todoDiv);

  // Clear input field
  todoInput.value = "";
}

function manageTask(e) {
  const item = e.target;
  const todo = item.parentElement;

  // Delete task
  if (item.classList.contains("trash-btn")) {
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }

  // Mark task as completed
  if (item.classList.contains("complete-btn")) {
    todo.classList.toggle("completed");
    updateTaskStatusInLocalStorage(todo, todo.classList.contains("completed") ? "completed" : "uncompleted");
  }

  // Edit task
  if (item.classList.contains("edit-btn")) {
    const oldText = todo.querySelector(".todo-item").innerText;
    const updatedText = prompt("Edit your task:", oldText);

    if (updatedText && updatedText.trim() !== "") {
      todo.querySelector(".todo-item").innerText = updatedText;
      updateTaskInLocalStorage(oldText, updatedText);
    }
  }
}



function filterTodo() {
  const todos = [...todoList.querySelectorAll(".todo")];
  const filterValue = filterOption.value;

  todos.forEach(todo => {
    switch (filterValue) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
        break;
      case "uncompleted":
        todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
}

// Local Storage Functions
function saveLocalTodos(todo) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push({ text: todo, status: "uncompleted" });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const updatedTodos = todos.filter(t => t.text !== todo.firstChild.innerText);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function updateTaskInLocalStorage(oldText, newText) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const task = todos.find(t => t.text === oldText);
  if (task) task.text = newText;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTaskStatusInLocalStorage(todo, status) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const task = todos.find(t => t.text === todo.firstChild.innerText);
  if (task) task.status = status;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach(task => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (task.status === "completed") todoDiv.classList.add("completed");

    const newTodo = document.createElement("li");
    newTodo.innerText = task.text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
  });
}
// Pomodoro Timer JavaScript
const counterForm = document.getElementById("counter-form");
const counterTitleInput = document.getElementById("counter-title-input");
const counterDateInput = document.getElementById("counter-date");
const counterSubmit = document.getElementById("counterSubmit");

const counterDiv = document.getElementById("counter");
const completeDiv = document.getElementById("complete");
const completeButton = document.getElementById("complete-button");
const counterReset = document.getElementById("counter-reset");

// Function to update the countdown
function updateCountdown(targetDate, counterTitle) {
    const now = new Date();
    const timeLeft = targetDate - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("counter-title").textContent = counterTitle;
    document.querySelector("#counter ul li:nth-child(1) span").textContent = days;
    document.querySelector("#counter ul li:nth-child(2) span").textContent = hours;
    document.querySelector("#counter ul li:nth-child(3) span").textContent = minutes;
    document.querySelector("#counter ul li:nth-child(4) span").textContent = seconds;

    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        counterDiv.hidden = true;
        completeDiv.hidden = false;
        document.getElementById("complete-info").textContent = `Countdown finished on ${targetDate.toLocaleDateString()}`;
    }
}

// Handle counter form submission
counterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const counterTitle = counterTitleInput.value.trim();
    const counterDate = new Date(counterDateInput.value);

    if (counterTitle && !isNaN(counterDate)) {
        counterDiv.hidden = false;
        completeDiv.hidden = true;
        updateCountdown(counterDate, counterTitle);

        // Start updating countdown every second
        countdownInterval = setInterval(function () {
            updateCountdown(counterDate, counterTitle);
        }, 1000);
    }
});

// Reset the countdown
counterReset.addEventListener("click", function () {
    clearInterval(countdownInterval);
    counterDiv.hidden = true;
    completeDiv.hidden = true;
    counterTitleInput.value = "";
    counterDateInput.value = "";
});

// Restart the countdown from the complete screen
completeButton.addEventListener("click", function () {
    counterDiv.hidden = true;
    completeDiv.hidden = true;
    counterTitleInput.value = "";
    counterDateInput.value = "";
});