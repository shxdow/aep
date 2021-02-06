const { app, protocol, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow = null;

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    standard: true,
    secure: true,
  },
}]);

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 800,
    height: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(url.format({
    path: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});
