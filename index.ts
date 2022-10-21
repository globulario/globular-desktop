import { ApplicationView } from "../globular-mvc/ApplicationView";
import { getTheme } from "../globular-mvc/components/Theme";
import "./css/main.css";
import { DesktopApplication, DesktopApplicationView } from "./src/application";
//import {hello}
/**
 * The main entry point of an applicaition.
 */
function main() {

  let view = new DesktopApplicationView();

  // The application.
  let application = new DesktopApplication(view);

  // Connected to the backend.
  let globular_config_address = ""
  if (!window.location.origin.startsWith("file://")) {
    globular_config_address = window.location.origin + "/config"
  } else if (localStorage.getItem("globular_config_address")) {
    globular_config_address = localStorage.getItem("globular_config_address")
  }

  application.init(
    globular_config_address,
    () => {
      /** here the application start correctly */

    },
    err => {
      if (err.startsWith("fail to get the configuration file at url")) {
        application.showConnectInput()
      }
    }
  );
}

/**
 * The main function will be call a the end of document initialisation.
 */
document.addEventListener("DOMContentLoaded", function (event) {
  main();
});