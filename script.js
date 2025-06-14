document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("taskCategory").value;
  const taskText = input.value.trim();
  if (!taskText) return;

  const time = new Date().toLocaleString();

  const task = {
    id: Date.now(),
    text: taskText,
    category: category,
    completed: false,
    time: time
  };

  createTaskElement(task);
  saveToLocalStorage(task);
  showToast("Task added!");
  input.value = "";
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  const span = document.createElement("span");
  span.textContent = task.text;

  const badge = document.createElement("span");
  badge.className = "category-badge";
  badge.textContent = task.category;

  const time = document.createElement("div");
  time.className = "timestamp";
  time.textContent = task.time;

  const actions = document.createElement("div");
  actions.className = "actions";

  li.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") {
      li.classList.toggle("completed");
      toggleComplete(task.id);
    }
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    const newText = prompt("Edit your task:", span.textContent);
    if (newText) {
      span.textContent = newText.trim();
      task.text = newText.trim();
      updateTask(task);
      showToast("Task updated!");
    }
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => {
    li.remove();
    removeFromLocalStorage(task.id);
    showToast("Task deleted!");
  };

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  span.appendChild(badge);
  li.appendChild(span);
  li.appendChild(actions);
  li.appendChild(time);

  if (task.completed) li.classList.add("completed");

  document.getElementById("taskList").appendChild(li);
}

function saveToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeFromLocalStorage(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.filter((task) => task.id !== id);
  updateLocalStorage(updated);
}

function toggleComplete(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((t) => {
    if (t.id === id) t.completed = !t.completed;
  });
  updateLocalStorage(tasks);
}

function updateTask(updatedTask) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  updateLocalStorage(updated);
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task));
}

function filterTasks() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const listItems = document.querySelectorAll("#taskList li");

  listItems.forEach((li) => {
    const taskText = li.querySelector("span").textContent.toLowerCase();
    li.style.display = taskText.includes(search) ? "flex" : "none";
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}
