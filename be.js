const communication = require('./communication')
const keys = require('./keys')
const moment = require('moment')
const transactions = require('./transactions')
const blockChainExplorer = require('./blockChainExplorer')
const state = require('./state')
const cli = require('./cli')
const discoverBlocks = require('./discoverBlocks')
const blocks = require('./blocks')

state.setKeyPair({
  privateKey: '89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0',
  publicKey: '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50'
})

let blockToBeDiscovered = blocks.createGenesisBlock({
  publicKey: state.keyPair().publicKey,
  privateKey: state.keyPair().privateKey,
  now: +moment.utc()
})

const onBlockDiscovered = ({blockState}) => {
  const isBlockValid = blocks.verifyBlock({blocks: state.blocks(), blockToBeVerified: blockState})
  if(!isBlockValid) return console.log('failed validation')

  state.addBlock({block: blockState})
  blockToBeDiscovered = blocks.createNextBlockFrame({
    blocks: state.blocks(),
    now: +moment.utc(),
    publicKey: state.keyPair().publicKey,
    privateKey: state.keyPair().privateKey
  })
}


communication.listenForOthers().then(() => {
  return communication.joinPeers()
}).catch(err => console.log(err))

setInterval(() => {
  discoverBlocks({blockToBeDiscovered, onBlockDiscovered})
}, 100)

cli()
