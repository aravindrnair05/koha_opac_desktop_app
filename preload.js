const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    navigateBack: () => ipcRenderer.send('navigate-back'),
    navigateForward: () => ipcRenderer.send('navigate-forward'),
    navigateRefresh: () => ipcRenderer.send('navigate-refresh'),
    navigateTo: (url) => ipcRenderer.send('navigate-to', url),
    onLoading: (callback) => ipcRenderer.on('loading', (event, isLoading) => callback(isLoading)),
    onHistoryUpdate: (callback) => ipcRenderer.on('history-update', (event, { history, currentIndex }) => callback(history, currentIndex))
});
