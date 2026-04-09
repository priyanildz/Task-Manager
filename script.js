let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedIndex = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Move completed tasks to bottom
function sortTasks() {
  tasks.sort((a, b) => a.completed - b.completed);
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  sortTasks(); // 👈 IMPORTANT

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true);

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">${task.text}</span>
      <div class="actions">
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    // ✅ Drag works on full item
    li.addEventListener("dragstart", (e) => {
      draggedIndex = index;
      e.dataTransfer.setData("text/plain", index);
      li.style.opacity = "0.5";
    });

    li.addEventListener("dragend", () => {
      li.style.opacity = "1";
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    li.addEventListener("drop", (e) => {
      e.preventDefault();

      const from = draggedIndex;
      const to = index;

      if (from === null || from === to) return;

      const item = tasks[from];
      tasks.splice(from, 1);
      tasks.splice(to, 0, item);

      draggedIndex = null;
      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) {
    alert("Task cannot be empty!");
    return;
  }

  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText && newText.trim()) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

renderTasks();