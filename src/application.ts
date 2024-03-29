import "materialize-css/sass/materialize.scss";
import { Application } from "../../globular-mvc/Application";
import { ApplicationType, ApplicationView } from "../../globular-mvc/ApplicationView";
import { Account } from "../../globular-mvc/Account";
import { SettingsMenu, SettingsPanel } from "../../globular-mvc/components/Settings"
import { Model } from "../../globular-mvc/Model";
import { File } from "../../globular-mvc/File";
import { format } from "path";

const electron = require('electron');
const path = require("path");
const fs = require("fs");

// This will save the file...
const saveArrayAsFile = (arrayBuffer, filePath) => {
  fs.writeFile(filePath, Buffer.from(arrayBuffer), 'binary', (err) => {
    if (err) {
      console.log("There was an error writing the image")
    }
    else {
      console.log("Written File :" + filePath)
    }
  });
};

File.removeLocal = (path:string, callback:()=>void) => {
  let userDataPath = (electron.app || electron.remote.app).getPath('userData');
  userDataPath = userDataPath.split(".")[0]
  let path_ = userDataPath + "globular" + path

  // remove a file.
  fs.unlink(path_, callback)
  
}

// Test if file has local copy...
File.hasLocal = (path: string, callback:(exists:boolean)=>void) => {
  // The file will be save in the node user data directory
  let userDataPath = (electron.app || electron.remote.app).getPath('userData');
  userDataPath = userDataPath.split(".")[0]
  let path_ = userDataPath + "globular" + path

  fs.exists(path_, (exists:boolean)=>{
    if(exists){

      console.log("file ", path_, " found!")
    }

    callback(exists)
  })
}

// Define file foncion 
File.saveLocal = (f: File, b: Blob) => {

  var fileReader = new FileReader();
  fileReader.onload = function (event) {
    let arrayBuffer = event.target.result;
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    userDataPath = userDataPath.split(".")[0]

    // The file will be save in the node user data directory
    let path_ = userDataPath + "globular" + f.path.substring(0, f.path.lastIndexOf("/"))

    // save the file in the user data path
    fs.mkdir(path_, { recursive: true }, (err) => {
      if (err) {
        console.log("There was an error creating the dir")
      } else {
        saveArrayAsFile(arrayBuffer, path_ + "/" + f.name)
      }
    })
  };
  fileReader.readAsArrayBuffer(b);
}

/** TODO move it to the application setting if the logged user is sa.
import { Terminal } from "../../globular-mvc/components/Terminal";
import { Console } from "../../globular-mvc/components/Console";
import { SystemMonitor } from "../../globular-mvc/components/SystemMonitor";
*/

export class DesktopApplicationView extends ApplicationView {

  /** The settings Menu */
  protected consoleSettingsMenu: SettingsMenu;

  /** The settings Panel */
  protected consoleSettingsPanel: SettingsPanel;

  constructor() {
    super();
    this.consoleSettingsMenu = new SettingsMenu();
    this.consoleSettingsPanel = new SettingsPanel();

    // In that case the type will be desktop...
    this.type = ApplicationType.DESKTOP

    // I will not display the applications menu for desktop application
    this.hideApplicationsMenu()
  }

  onLogin(account: Account) {

    super.onLogin(account);

    // fire the window resize event to display the side menu.
    window.dispatchEvent(new Event('resize'));
    this.getWorkspace()

  }

  onLogout() {
    super.onLogout();
    this.getWorkspace().innerHTML = "";
    this.consoleSettingsMenu.clear(); // clear various stuff...
    this.consoleSettingsPanel.clear();
  }

}

export class DesktopApplication extends Application {
  constructor(view: DesktopApplicationView) {
    // console is the equivalent web application, so I will use it...
    super("console", "Globular Desktop", view);

    console.log('local file system', fs);
  }


  showConnectInput() {

    // Here I will ask the user to enter the server address...
    let toast = ApplicationView.displayMessage(`
    <style>
       #select-media-dialog{
        background-color: var(--palette-primary-accent);
        color: var(--palette-text-accent);
       }
    </style>
    <div id="select-media-dialog">
        <div>please enter the address of the server and click the ok button</div>
        <paper-input autofocus no-label-float></paper-input>
        <div style="display: flex; justify-content: flex-end;">
            <paper-button id="ok-button">Ok</paper-button>
            <paper-button id="cancel-button">Cancel</paper-button>
        </div>
    </div>
    `, 60 * 15 * 1000)

    let addressInput = <any>(toast.el.querySelector("paper-input"))
    setTimeout(() => {
      addressInput.focus()
    }, 100);

    let cancelBtn = <any>(toast.el.querySelector("#cancel-button"))
    cancelBtn.onclick = () => {
      toast.dismiss();
    }

    let okBtn = <any>(toast.el.querySelector("#ok-button"))
    okBtn.onclick = () => {
      toast.dismiss();
      let address = addressInput.value
      this.init(address + "/config", () => {
        localStorage.setItem("globular_config_address", address + "/config")
      }, this.showConnectInput)
    }

  }
}
