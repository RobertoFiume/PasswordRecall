const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
let mainWindow;
function createWindow() {
    // mainWindow = new BrowserWindow({ titleBarStyle: 'hidden', width: 900, height: 680 });    // hidden border on macos
    mainWindow = new BrowserWindow({ width: 900, height: 680 });
    mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);
    mainWindow.removeMenu();
    mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});