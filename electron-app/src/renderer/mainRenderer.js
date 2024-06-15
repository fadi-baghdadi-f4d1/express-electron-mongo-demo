document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');

    // Function to add a new task
    const addTask = () => {
        const taskText = taskInput.value;
        if (taskText) {
            const taskCount = taskList.getElementsByTagName('li').length;
            const newTask = { task: taskText, num: taskCount + 1 };
            window.api.send('add-task', newTask);
            taskInput.value = '';
        }
    };

    // Form submit event listener
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from actually submitting
        addTask();
    });


    // Function to create a list item with edit and delete buttons
    const createTaskListItem = (task) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${task.num}: ${task.task}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => openEditWindow(task));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task, listItem));

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    };

    // Function to render tasks
    function renderTasks(tasks) {
        // Clear existing tasks if it's a reload operation
        if (taskList.innerHTML !== '' && tasks.length > 0) {
            taskList.innerHTML = '';
        }

        // Render new or updated tasks
        tasks.forEach(task => {
            const listItem = createTaskListItem(task);
            taskList.appendChild(listItem);
        });
    }

    // Function to open the edit window
    const openEditWindow = (task) => {
        window.api.send('open-edit-window', task);
    };

    // Function to handle deleting a task
    const deleteTask = (task, listItem) => {
        window.api.send('delete-task', task);
        taskList.removeChild(listItem);
    };

    window.api.receive('task-added', (task) => {
        const listItem = createTaskListItem(task);
        taskList.appendChild(listItem);
    });

    // Receive load-tasks event
    window.api.receive('load-tasks', (tasks) => {
        renderTasks(tasks);
    });

    // Receive reload-tasks event
    window.api.receive('reload-tasks', (tasks) => {
        renderTasks(tasks);
    });
});