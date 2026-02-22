const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  // 🔥 Auto update check
  autoUpdater.checkForUpdatesAndNotify();
});

// Optional logging
autoUpdater.on("update-available", () => {
  console.log("Update available.");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded. Installing...");
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});