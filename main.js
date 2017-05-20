const {app, BrowserWindow, TouchBar, Menu} = require('electron');
const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

require('electron-context-menu')();

let mainWindow;

if (!isDev && process.platform !== 'linux') {
	const autoUpdater = require("electron-updater").autoUpdater;
	autoUpdater.logger = require('electron-log');
	autoUpdater.logger.transports.file.level = 'info';
	autoUpdater.checkForUpdates();
}

const touchBar = new TouchBar([
  new TouchBarButton({
    label: 'Open',
    click: () => { mainWindow.webContents.send('open'); }
  }),
  new TouchBarSpacer({size: 'small'}),
  new TouchBarButton({
    label: 'Reload',
    click: () => { mainWindow.webContents.send('reload'); }
  }),
  new TouchBarSpacer({size: 'large'}),
  new TouchBarButton({
    label: 'Save',
    backgroundColor: '#0275d8',
    click: () => { mainWindow.webContents.send('save'); }
  }),
])

function createWindow () {  
	
  mainWindow = new BrowserWindow({width: 800, height: 600, icon: path.join(__dirname, 'icons/icon.png')})
  mainWindow.setTouchBar(touchBar)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  });
	
	Menu.setApplicationMenu(require('./menu'));
  
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
