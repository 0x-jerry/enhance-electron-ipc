const { ipcMain, ipcRenderer, remote } = require('electron')

const main = {
  _uuid: 0,
  _ipc: ipcMain || remote.ipcMain,
  on(channel, cb) {
    ipcMain.on(`main:${channel}`, async (e, targetChannel, ...args) => {
      const result = await cb(e, ...args)
      e.sender.send(targetChannel, result)
    })
  }
}

const render = {
  _uuid: 0,
  _ipc: ipcRenderer,
  on(channel, cb) {
    ipcMain.on(`render:${channel}`, async (e, targetChannel, ...args) => {
      const result = await cb(e, ...args)
      e.sender.send(targetChannel, result)
    })
  },
  send(channel, ...args) {
    return new Promise((resolve, reject) => {
      const sendChannel = `main:${channel}`
      if (main._ipc.eventNames().indexOf(sendChannel) < 0) {
        return reject('no channel ' + channel)
      }

      const receiveChannel = `render:${this._uuid++}:${channel}`

      ipcRenderer.once(receiveChannel, (e, ..._args) => resolve(_args))
      ipcRenderer.send(sendChannel, receiveChannel, ...args)
    })
  },
  sendTo(webContentsId, channel, ...args) {
    return new Promise((resolve, reject) => {
      const webContent = remote.webContents.fromId(webContentsId)
      if (!webContent) {
        return reject('invalid web content id')
      }

      const sendChannel = `render:${channel}`

      if (webContent.eventNames().indexOf(sendChannel) < 0) {
        return reject('target web content no channel ' + channel)
      }

      const receiveChannel = `render:${this._uuid++}:${channel}`

      ipcRenderer.once(receiveChannel, (e, ..._args) => resolve(_args))
      ipcRenderer.sendTo(webContentsId, channel, receiveChannel, ...args)
    })
  }
}

module.exports = {
  main,
  render
}
