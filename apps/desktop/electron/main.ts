import { app, BrowserWindow } from 'electron';

function createWindow() {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
  });

  window.loadURL('https://google.com');
}

app.whenReady().then(createWindow);
