const {app, BrowserWindow, TouchBar, Menu} = require('electron');
const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const config = require('./config.js');

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
	
	const lastWindowState = config.get('lastWindowState');
	
  mainWindow = new BrowserWindow({
		x: lastWindowState.x,
		y: lastWindowState.y,
		width: lastWindowState.width,
		height: lastWindowState.height,
		icon: path.join(__dirname, 'icons/icon.png')
	});
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

app.on('before-quit', () => {
	isQuitting = true;

	if (!mainWindow.isFullScreen()) {
		config.set('lastWindowState', mainWindow.getBounds());
	}
});
