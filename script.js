const taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="${task.completed ? "completed" : ""}">
        ${task.text}
      </span>
      <button class="delete">Eliminar</button>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector(".delete");
    const text = li.querySelector("span");

    checkbox.addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    text.addEventListener("dblclick", () => {
      const newText = prompt("Editar tarea:", task.text);
      if (newText) {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    });

    taskList.appendChild(li);
  });

  updatePendingCount();
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("La tarea no puede estar vacía");
    return;
  }

  tasks.push({
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

function updatePendingCount() {
  const count = tasks.filter(task => !task.completed).length;
  pendingCount.textContent = count + " tareas pendientes";
}

document.querySelectorAll(".filters button").forEach(button => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();