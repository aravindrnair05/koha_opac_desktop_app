const { app, BrowserWindow, ipcMain } = require('electron');

let history = [];
let currentIndex = -1;

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        frame: false,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    win.loadURL('<<YOUR_OPACURL>>');

    win.webContents.on('did-start-loading', () => {
        win.webContents.send('loading', true);
    });

    win.webContents.on('did-stop-loading', () => {
        win.webContents.send('loading', false);
        const currentURL = win.webContents.getURL();
        if (currentIndex === -1 || history[currentIndex] !== currentURL) {
            history = history.slice(0, currentIndex + 1); // Trim forward history
            history.push(currentURL);
            currentIndex++;
            win.webContents.send('history-update', { history, currentIndex });
        }
    });

    ipcMain.on('navigate-back', () => {
        if (currentIndex > 0) {
            currentIndex--;
            const url = history[currentIndex];
            win.loadURL(url);
        }
    });

    ipcMain.on('navigate-forward', () => {
        if (currentIndex < history.length - 1) {
            currentIndex++;
            const url = history[currentIndex];
            win.loadURL(url);
        }
    });

    ipcMain.on('navigate-refresh', () => {
        win.webContents.reload();
    });

    ipcMain.on('navigate-to', (event, url) => {
        win.loadURL(url);
    });

    win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
