// ===============================
// Smart Student Task & Activity Management System
// Required topics are used intentionally as requested.
// ===============================

// 10) Priority Mapping using Map
const priorityColorMap = new Map([
  ["Low", "success"],
  ["Medium", "warning"],
  ["High", "danger"],
]);

// App state: 2) Objects & Arrays
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

// DOM references
const loginSection = document.getElementById("loginSection");
const taskSection = document.getElementById("taskSection");
const controlSection = document.getElementById("controlSection");
const statsSection = document.getElementById("statsSection");
const listSection = document.getElementById("listSection");

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeText = document.getElementById("welcomeText");

const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskDueDate = document.getElementById("taskDueDate");

const taskTableBody = document.getElementById("taskTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statInProgress = document.getElementById("statInProgress");
const statCompleted = document.getElementById("statCompleted");

// 1) Login System using SessionStorage
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = usernameInput.value.trim();

  if (username.length === 0) {
    alert("Please enter your name.");
    return;
  }

  sessionStorage.setItem("studentUser", username);
  usernameInput.value = "";
  applySessionState();
});

logoutBtn.addEventListener("click", function () {
  sessionStorage.removeItem("studentUser");
  applySessionState();
});

function applySessionState() {
  const currentUser = sessionStorage.getItem("studentUser");

  if (currentUser) {
    welcomeText.textContent = `Welcome, ${currentUser}!`;
    taskSection.classList.remove("d-none");
    controlSection.classList.remove("d-none");
    statsSection.classList.remove("d-none");
    listSection.classList.remove("d-none");
  } else {
    welcomeText.textContent = "Please login to manage tasks.";
    taskSection.classList.add("d-none");
    controlSection.classList.add("d-none");
    statsSection.classList.add("d-none");
    listSection.classList.add("d-none");
  }

  renderTasks();
}

// 2) Task Creation (Object)
// 3) Task Storage in LocalStorage
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskObject = {
    id: Date.now(),
    name: taskName.value.trim(),
    description: taskDescription.value.trim(),
    category: taskCategory.value.trim(),
    priority: taskPriority.value,
    status: taskStatus.value,
    dueDate: taskDueDate.value,
  };

  tasks.push(taskObject);
  saveTasks();
  taskForm.reset();
  taskPriority.value = "Medium";
  taskStatus.value = "Pending";
  renderTasks();
});

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// 5) Search Tasks using String methods
function getSearchedTasks(taskArray) {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword.length === 0) {
    return taskArray;
  }

  return taskArray.filter(function (task) {
    const nameMatch = task.name.toLowerCase().includes(keyword);
    const categoryMatch = task.category.toLowerCase().includes(keyword);
    const descriptionMatch = task.description.toLowerCase().includes(keyword);

    return nameMatch || categoryMatch || descriptionMatch;
  });
}

// 6) Filter Tasks using Switch Case
function getFilteredTasks(taskArray) {
  const selectedStatus = statusFilter.value;
  const selectedCategory = categoryFilter.value;

  let filteredByStatus = [];

  switch (selectedStatus) {
    case "Pending":
      filteredByStatus = taskArray.filter((task) => task.status === "Pending");
      break;
    case "In Progress":
      filteredByStatus = taskArray.filter((task) => task.status === "In Progress");
      break;
    case "Completed":
      filteredByStatus = taskArray.filter((task) => task.status === "Completed");
      break;
    default:
      filteredByStatus = taskArray;
  }

  if (selectedCategory === "All") {
    return filteredByStatus;
  }

  return filteredByStatus.filter(function (task) {
    return task.category === selectedCategory;
  });
}

// 9) Unique Categories with Set
function refreshCategoryFilter() {
  const uniqueCategories = new Set();

  tasks.forEach(function (task) {
    uniqueCategories.add(task.category);
  });

  const previousValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="All">All</option>';

  uniqueCategories.forEach(function (categoryName) {
    const option = document.createElement("option");
    option.value = categoryName;
    option.textContent = categoryName;
    categoryFilter.appendChild(option);
  });

  if ([...uniqueCategories].includes(previousValue)) {
    categoryFilter.value = previousValue;
  }
}

// 7) Task Status using If-Else Ladder
function getStatusNote(status) {
  if (status === "Pending") {
    return "Task has not started yet.";
  } else if (status === "In Progress") {
    return "Task is currently in progress.";
  } else if (status === "Completed") {
    return "Task is successfully completed.";
  } else {
    return "Unknown status.";
  }
}

// 11) Statistics Dashboard using Operators & Loops
function renderStats(taskArray) {
  let pendingCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;

  for (let index = 0; index < taskArray.length; index += 1) {
    if (taskArray[index].status === "Pending") {
      pendingCount += 1;
    } else if (taskArray[index].status === "In Progress") {
      inProgressCount += 1;
    } else if (taskArray[index].status === "Completed") {
      completedCount += 1;
    }
  }

  statTotal.textContent = taskArray.length;
  statPending.textContent = pendingCount;
  statInProgress.textContent = inProgressCount;
  statCompleted.textContent = completedCount;
}

// 4) Display Tasks using Loops
function renderTasks() {
  refreshCategoryFilter();
  const searched = getSearchedTasks(tasks);
  const finalTasks = getFilteredTasks(searched);

  taskTableBody.innerHTML = "";

  for (let i = 0; i < finalTasks.length; i += 1) {
    const task = finalTasks[i];
    const colorClass = priorityColorMap.get(task.priority) || "secondary";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.name}</td>
      <td>${task.category}</td>
      <td><span class="badge text-bg-${colorClass} priority-badge">${task.priority}</span></td>
      <td>
        <select class="form-select form-select-sm" data-status-id="${task.id}">
          <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
        <div class="status-note text-muted">${getStatusNote(task.status)}</div>
      </td>
      <td>${task.dueDate}</td>
      <td>${task.description}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" data-delete-id="${task.id}">Delete</button>
      </td>
    `;

    taskTableBody.appendChild(row);
  }

  renderStats(tasks);
}

// 8) Delete Tasks using Array Methods
taskTableBody.addEventListener("click", function (event) {
  const deleteId = event.target.getAttribute("data-delete-id");

  if (!deleteId) {
    return;
  }

  const idAsNumber = Number(deleteId);
  tasks = tasks.filter(function (task) {
    return task.id !== idAsNumber;
  });

  saveTasks();
  renderTasks();
});

// Manage task status updates
taskTableBody.addEventListener("change", function (event) {
  const statusId = event.target.getAttribute("data-status-id");

  if (!statusId) {
    return;
  }

  const selectedStatus = event.target.value;
  const idAsNumber = Number(statusId);

  tasks = tasks.map(function (task) {
    if (task.id === idAsNumber) {
      return { ...task, status: selectedStatus };
    }
    return task;
  });

  saveTasks();
  renderTasks();
});

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
categoryFilter.addEventListener("change", renderTasks);

applySessionState();
