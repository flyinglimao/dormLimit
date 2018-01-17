const electron = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

let mainWindow, watchdog

function start () {
  mainWindow = new BrowserWindow({width: 300, height: 28, frame: false, resizable: false, skipTaskBar: true})
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'main.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    app.quit()
  })

  watchdog = new BrowserWindow({show: false})

  refresh()
  setInterval(refresh, 600000)
}

function refresh () {
  watchdog.loadURL('https://network.ntust.edu.tw/')
  watchdog.webContents.on('did-finish-load', () => {
    watchdog.webContents.executeJavaScript(`document.querySelector('#ContentPlaceHolder1_gvFlowStatistics > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(5)').innerHTML.replace(/\\s/g, '')`, ctx => {
      mainWindow.webContents.executeJavaScript(`document.body.innerHTML = '${ctx}'`)
    })
  })
}

app.on('ready', start)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('active', () => {
  if (mainWindow === null) {
    start()
  }
})
