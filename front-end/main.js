require('./src/secrets');

// eslint-disable-next-line
const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('path');

const cookies = require('./electron/cookies');
const menu = require('./electron/menu');

let mainWindow = null;

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

  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(menu);
};

const saveCookiesOnIncomingRequests = (details, callback) => {
  const { responseHeaders: headers } = details;
  if (headers['Set-Cookie']) {
    cookies.parseFromHeader(headers['Set-Cookie']);
  }
  callback(details);
};

const addCookiesToHeaders = (details, callback) => {
  const newDetails = { ...details };
  const isXhr = details.resourceType === 'xhr';
  const goingToTheServer = details.url.startsWith(global.SERVER_ADDRESS);

  if (isXhr && goingToTheServer) {
    newDetails.requestHeaders = {
      ...newDetails.requestHeaders,
      ...(details.method !== 'GET'
        ? { 'x-csrftoken': cookies.get('csrftoken') }
        : {}),
      cookie: cookies.stringify(),
    };
  }
  callback(newDetails);
};

app.on('ready', () => {
  const { webRequest } = session.defaultSession;
  webRequest.onBeforeSendHeaders(addCookiesToHeaders);
  webRequest.onHeadersReceived(saveCookiesOnIncomingRequests);
  createWindow();
});

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
