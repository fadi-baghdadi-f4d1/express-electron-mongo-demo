const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        console.log(data)
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
