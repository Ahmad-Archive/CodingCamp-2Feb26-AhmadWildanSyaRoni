let tasks = [];
let currentFilter = "all";

document.getElementById("dateInput").valueAsDate = new Date();

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskInput.value,
    dueDate: dateInput.value,
    status: "pending",
  };

  tasks.push(task);
  taskInput.value = "";
  dateInput.valueAsDate = new Date();

  renderTasks();
}

function deleteTask(id) {
  if (confirm("Apakah kamu yakin ingin menghapus task ini?")) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  }
}

function updateStatus(id, newStatus) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.status = newStatus;
    renderTasks();
  }
}

function deleteAllTasks() {
  if (tasks.length === 0) {
    alert("Tidak ada task yang dapat dihapus!");
    return;
  }

  if (confirm(`Yakin nih mau hapus semua ${tasks.length} task?`)) {
    tasks = [];
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function renderTasks() {
  const tbody = document.getElementById("taskTableBody");

  let filteredTasks = tasks;
  if (currentFilter !== "all") {
    filteredTasks = tasks.filter((task) => task.status === currentFilter);
  }

  if (filteredTasks.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="empty-state">No Task Found</td></tr>';
    return;
  }

  tbody.innerHTML = filteredTasks
    .map((task) => {
      const statusText =
        task.status === "pending"
          ? "Pending"
          : task.status === "done"
            ? "Completed"
            : "Cancelled";
      const statusClass =
        task.status === "pending"
          ? "status-pending"
          : task.status === "done"
            ? "status-done"
            : "status-cancel";

      return `
                <tr>
                    <td>${task.name}</td>
                    <td>${formatDate(task.dueDate)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${task.status !== "done" ? `<button class="btn-action btn-completed" onclick="updateStatus(${task.id}, 'done')">Completed</button>` : ""}
                            ${task.status !== "cancel" ? `<button class="btn-action btn-cancel" onclick="updateStatus(${task.id}, 'cancel')">Cancel</button>` : ""}
                            <button class="btn-action btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
    })
    .join("");
}

document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

renderTasks();
