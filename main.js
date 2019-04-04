const { app, BrowserWindow } = require('electron')
const ipc = require('./ipc')

app.on('ready', () => {
  let win = new BrowserWindow({ width: 800, height: 600 })

  win.loadFile('index.html')
})

ipc.main.on('ping', (e, ...args) => {
  console.log(args)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('pong')
    }, 10 * 1000)
  })
})
