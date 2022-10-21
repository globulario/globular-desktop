const { app, BrowserWindow} = require('electron')

// keep the local file system in the global object.
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        resizable: true,
        closable: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Load the entry point...
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`)

    // use it at developpement time.
    mainWindow.webContents.openDevTools()
}


// When the window is ready...
app.on('ready', createMainWindow)