document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('taskInput');
    const taskDesc = document.getElementById('taskDesc');
    const taskTableBody = document.getElementById('taskTableBody');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load saved tasks from local storage
    loadTasks();

    // Add Task Event
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDescription = taskDesc.value.trim();

        if (taskText) {
            addTask(taskText, taskDescription);
            taskInput.value = ''; // Clear input
            taskDesc.value = '';  // Clear description
        }
    });

    // Add Task Function
    function addTask(task, description) {
        const taskObj = {
            id: Date.now(),
            text: task,
            description: description || 'No description provided',
            completed: false,
            time: null,  // Initially no time is set
            date: new Date().toLocaleDateString()
        };
        tasks.push(taskObj);
        saveTasks();
        renderTask(taskObj);
    }

    // Render Task to Table
    function renderTask(taskObj, index) {
        const row = document.createElement('tr');
        row.dataset.id = taskObj.id;

        const timeDisplay = taskObj.time ? taskObj.time : '-';

        row.innerHTML = `
            <td>${taskObj.text}</td>
            <td>${taskObj.completed ? '✔️' : '❗'}</td>
            <td>${timeDisplay}</td>
            <td>${taskObj.date}</td>
            <td>${taskObj.description}</td>
            <td>
                <button class="btn btn-success btn-sm me-2 complete-btn">Complete</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        `;

        taskTableBody.appendChild(row);
    }

    // Load tasks from localStorage and display them
    function loadTasks() {
        taskTableBody.innerHTML = ''; // Clear table
        tasks.forEach((task, index) => renderTask(task, index));
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Task List Event Listener (Complete, Delete)
    taskTableBody.addEventListener('click', function(e) {
        const taskId = e.target.closest('tr').dataset.id;
        const task = tasks.find(t => t.id == taskId);

        if (e.target.classList.contains('complete-btn')) {
            // Mark task as complete and set current time in 24-hour format (railway time)
            task.completed = true;
            task.time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            saveTasks();
            loadTasks(); // Re-render table with updated task
        } else if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(t => t.id != taskId);
            saveTasks();
            loadTasks();
        }
    });
});