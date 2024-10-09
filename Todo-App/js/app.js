document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("#form-taken");
    const inputTask = document.querySelector("#input-area");
    const taskList = document.querySelector(".output ul");
    const searchInput = document.querySelector("#listsearch");

    loadTasks();

    form.addEventListener("submit", addTask);
    taskList.addEventListener("click", handleTaskAction);
    searchInput.addEventListener("input", searchTasks);

    function addTask(e) {
        e.preventDefault();
        if (inputTask.value.trim() === "") {
            alert("Enter the task");
        } else {
            createTaskElement(inputTask.value);
            saveTask(inputTask.value);
            inputTask.value = "";
        }
    }

    function handleTaskAction(e) {
        if (e.target.classList.contains('remove-task')) {
            removeTask(e.target.parentElement.parentElement);
        } else if (e.target.classList.contains('toggle-complete')) {
            toggleComplete(e.target.parentElement.parentElement);
        }
    }

    function createTaskElement(task, completed = false) {
        const li = document.createElement("li");
        li.className = 'd-flex align-items-center justify-content-between my-4';
        if (completed) li.classList.add('completed');
        li.innerHTML = `
            <span>${task}</span>
            <div>
                <button class="remove-task">Remove</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function removeTask(taskItem) {
        const taskText = taskItem.querySelector('span').textContent;
        taskItem.remove();
        removeTaskFromStorage(taskText);
    }

    function toggleComplete(taskItem) {
        const taskText = taskItem.querySelector('span').textContent;
        taskItem.classList.toggle('completed');
        updateTaskStatusInStorage(taskText);
    }

    function saveTask(task) {
        let tasks = getTasksFromStorage();
        tasks.push({ task: task, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromStorage(taskText) {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskStatusInStorage(taskText) {
        let tasks = getTasksFromStorage();
        tasks = tasks.map(task => {
            if (task.task === taskText) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromStorage() {
        let tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        let tasks = getTasksFromStorage();
        tasks.forEach(taskObj => {
            createTaskElement(taskObj.task, taskObj.completed);
        });
    }

    function searchTasks(e) {
        const query = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('.output li');
        tasks.forEach(task => {
            const taskText = task.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(query)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }
});
