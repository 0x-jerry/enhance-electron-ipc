const ipc = require('./ipc')

const $btn = document.createElement('button')

$btn.innerText = 'ping'

$btn.onclick = async () => {
  const a = await ipc.render.send($btn.innerHTML, 'ping')
  console.log(a)

  try {
    await ipc.render.send('test')
  } catch (error) {
    console.log(error)
  }
}

document.body.append($btn)
