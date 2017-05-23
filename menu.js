const {app, Menu, BrowserWindow} = require('electron')
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');


function openPreferences(){
  configWindow = new BrowserWindow({
    width: 400,
    height: 300
  });
  configWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'preferences.html'),
    protocol: 'file:',
    slashes: true
  }));
}


const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/christofferok/langly') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {
        label: 'Preferences...', 
        accelerator: 'CommandOrControl+,',
        click() {
          openPreferences();
        }
      },
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  });

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  );

  // Window menu
  template[2].submenu = [
    {role: 'close'},
    {role: 'minimize'},
  ]
}
else{
  // Edit menu
  template[1].submenu.push(
    {
      label: 'Preferences...', 
      accelerator: 'CommandOrControl+,',
      click() {
        openPreferences();
      }
    }
  );
}


if(isDev){
  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {role: 'reload'},
    {role: 'toggledevtools'}
  );
}


module.exports = Menu.buildFromTemplate(template);
