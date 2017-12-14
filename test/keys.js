const keys = require('../keys')

const publicKey = '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50'
const privateKey = '89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0'
const message = JSON.stringify({
  writer: '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50',
  message: 'some message'
})

const signature = keys.sign({message, privateKey})
if(signature !== '30450221009e8f293bcc9c7c269e80d36960d88d33d07f3263c079590bb63a645bb9ab9c05022022d9471c7c55563939753f5741243cf0b8de59acfb13a6bd01aa8e949f26657a') throw 'failed signature'

const isVerified = keys.verify({message, signature, publicKey})
if(isVerified !== true) throw 'verification fail'
