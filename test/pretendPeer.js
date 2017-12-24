// const socketServer = require('socket.io').listen(13338)
const socketClient = require("socket.io-client")

const client = socketClient('http://localhost:13337')
client.on('connect', () => {
  console.log('started connection')
  client.on('peers', peers => {
    console.log('on peers')
    console.log(peers)
  })

  client.on('blockDiscovered', block => {
    console.log('on block')
    console.log(block)
  })
})
