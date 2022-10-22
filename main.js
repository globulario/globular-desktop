const { app, protocol, remote, BrowserWindow } = require('electron')
const path = require('path')

function fileHandler(req, callback) {
    let requestedPath = req.url
    // Write some code to resolve path, calculate absolute path etc
    let check = true// Write some code here to check if you should return the file to renderer process
    if (!check) {
        callback({
            // -6 is FILE_NOT_FOUND
            // https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h
            error: -6
        });
        return;
    }

    let userDataPath = (app || remote.app).getPath('userData');
    userDataPath = userDataPath.split(".")[0]
    let path_ = userDataPath + "globular" + req.url.replace("local-media://", "")

    console.log(req.url, path_)

    callback({
        path: path_
    });

}

// keep the local file system in the global object.
function createMainWindow() {
    console.log(path.join(__dirname, './images/globular_logo.png'))
    const mainWindow = new BrowserWindow({
        icon: path.join(__dirname, './logo.ico'),
        resizable: true,
        closable: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        }
    })

    // Load the entry point...
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`)

    protocol.registerFileProtocol(
        'local-media',
        fileHandler,
    );

}


// When the window is ready...
app.on('ready', createMainWindow)