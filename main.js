const {app, BrowserWindow, TouchBar} = require('electron')

const path = require('path')
const url = require('url')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

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
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, icon: path.join(__dirname, 'icons/icon.png')})
  mainWindow.setTouchBar(touchBar)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
