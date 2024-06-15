require('dotenv').config();

const nodeServer = process.env.NODE_SERVER_HOST
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

// create main window
let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Fetch tasks and send them to the renderer process
    fetchTasks().then(tasks => {
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('load-tasks', tasks);
        });
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('active', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

// Handle add-task event
ipcMain.on('add-task', async (event, task) => {
    try {
        const response = await axios.post(`${nodeServer}/api/task`, task);
        event.reply('task-added', response.data);
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

// Handle edit-task event
ipcMain.on('edit-task', async (event, task) => {
    try {
        const editedTask = {
            "task": task.task
        }
        await axios.patch(`${nodeServer}/api/task/${task._id}`, editedTask);
        // mainWindow.webContents.send('reload-tasks');     
        fetchTasks().then(tasks => {
            mainWindow.webContents.send('reload-tasks', tasks);
        });
    } catch (error) {
        console.error('Error edit-task task:', error);
    }
});

// Handle delete-task event
ipcMain.on('delete-task', async (event, task) => {
    try {
        await axios.delete(`${nodeServer}/api/task/${task._id}`);
        event.reply('task-deleted', task);
    } catch (error) {
        console.error('Error delete-task task:', error);
    }
});

// Handle open-edit-window event
ipcMain.on('open-edit-window', (event, task) => {
    const editWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'edit-preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    editWindow.loadFile(path.join(__dirname, 'editView.html'));

    editWindow.webContents.once('did-finish-load', () => {
        editWindow.webContents.send('load-task', task);
    });

    // Open the DevTools.
    editWindow.webContents.openDevTools();
});

// fetching tasks
async function fetchTasks() {
    try {
        const response = await axios.get(`${nodeServer}/api/task`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}