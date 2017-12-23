const keys = require('../keys')

const publicKey = '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50'
const privateKey = '89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0'
const message = JSON.stringify({
  publicKey: '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50',
  message: 'some message'
})

const signature = keys.sign({message, privateKey})
if(signature !== '304402207a7c71db5d38d14cec1c187ae06c9e86e1b12c9e6a3bdb0a7b780aa4537cee5d022008542bdf5da954f10fdab1f4ab273c3b46c67f7510de9a847d84b2201604d624') throw 'failed signature'

const isVerified = keys.verify({message, signature, publicKey})
if(isVerified !== true) throw 'verification fail'

console.log('all passed')
