document.addEventListener('DOMContentLoaded', () => {
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditButton = document.getElementById('saveEditButton');
    const cancelButton = document.getElementById('cancelButton');
    let currentTask = null;

    window.api.receive('load-task', (task) => {
        currentTask = task;
        editTaskInput.value = task.task;
    });

    saveEditButton.addEventListener('click', () => {
        const newTaskText = editTaskInput.value;
        if (newTaskText && currentTask) {
            const updatedTask = { ...currentTask, task: newTaskText };
            window.api.send('edit-task', updatedTask);
            window.close();
            // // Reload tasks after successful edit
            // window.api.send('reload-tasks');
        }
    });

    cancelButton.addEventListener('click', () => {
        window.close();
    });
});