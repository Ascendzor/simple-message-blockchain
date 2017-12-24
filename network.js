const state = require('./state')
const socketServer = require('socket.io').listen(13337)
const blocks = require('./blocks')
const socketClient = require("socket.io-client")
let peers = []

module.exports = {
  joinMesh: () => {
    socketServer.on('connection', connection => {
      console.log('on connection')
      peers.push({
        ip: connection.handshake.headers.host.split(':')[0],
        port: connection.handshake.headers.host.split(':')[1]
      })
      connection.on('blockDiscovered', body => {
        const response = blocks.verifyBlock({blocks: state.blocks(), blockToBeVerified: body})
        if(!response.err) state.addBlock({block: body})
      })

      connection.on('peers', body => {
        console.log('on peers')
        console.log(body)
        if(peers.length < 16) {
          body.peers.forEach(ip => {
            if(!peers.includes(ip)) {
              const newClient = io.connect(ip + ':13337')
              newClient.on('connect', socket => {
                socket.emit('server custom event', { my: 'data' });
              })
              peers.push(ip)
            }
          })
        }
      })
    })

    setInterval(() => {
      socketServer.emit('peers', {peers})
    }, 5000)
  },
  broadcastBlock: ({block}) => {
    socketServer.emit('blockDiscovered', block)
  }
}
