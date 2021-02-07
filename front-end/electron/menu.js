require('../src/secrets');

const { app, Menu, shell } = require('electron');

const isMac = process.platform === 'darwin';

const appMenu = [{
  label: app.name,
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ],
}];

const fileMenu = {
  label: 'File',
  submenu: [
    isMac ? { role: 'close' } : { role: 'quit' },
  ],
};

const editMenu = {
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    ...(isMac ? [
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startSpeaking' },
          { role: 'stopSpeaking' },
        ],
      },
    ] : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
  ],
};

const viewMenu = {
  label: 'View',
  submenu: [
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' },
  ],
};

const windowMenu = {
  label: 'Window',
  submenu: [
    { role: 'minimize' },
    { role: 'zoom' },
    ...(isMac ? [
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' },
    ] : [{ role: 'close' }]),
  ],
};

const template = [
  ...(isMac ? appMenu : []),
  fileMenu,
  editMenu,
  viewMenu,
  windowMenu,
  {
    role: 'help',
    submenu: [{
      label: 'Web Version',
      click: async () => {
        await shell.openExternal(global.ELECTRON_PRODUCTION_SPA_ADDRESS);
      },
    }],
  },
];

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
