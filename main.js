const {app, BrowserWindow} = require('electron')
function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Globular Desktop 1.0",
        resizable: true,
        closable: true
    })

    // mainWindow.loadURL('https://globule-dell.globular.cloud/console')
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`)
    // use it at developpement time.
    mainWindow.webContents.openDevTools()
}


// When the window is ready...
app.on('ready', createMainWindow)