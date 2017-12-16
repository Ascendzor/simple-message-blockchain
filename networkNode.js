const communication = require('./communication')
const blockStateToCanonicalArray = require('./blockStateToCanonicalArray')
const hashBlockState = require('./hashBlockState')
const merklinateTransactions = require('./merklinateTransactions')
const omit = require('lodash/omit')
const last = require('lodash/last')
const readline = require('readline')
const keys = require('./keys')
const moment = require('moment')
const adjustDifficulty = require('./adjustDifficulty')

let genesisBlockState = {
  previousHash: null,
  merkleRoot: null,
  difficulty: 0x000000ffffffffff,
  transactions: [{
    from: 'the big bang',
    to: 'someones public address'
  }],
  nonce: null,
  number: 0,
  timeStamp: +moment.utc()
}

let blockState = blockStateToCanonicalArray({state: genesisBlockState})
let blockToBeConfirmed = genesisBlockState

let blocks = [genesisBlockState]
let memPool = []

let keyPair = {
  privateKey: '89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0',
  publicKey: '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50'
}

const getLast16BlockTimeStamps = ({blocks}) => {
  return blocks.filter((block, key) => ((key+16) > blocks.length)).map(b => b.timeStamp)
}

const publishBlockFound = ({state, hash, nonce}) => {
  const previousBlock = last(blocks)
  const currentTimeStamp = +moment.utc()
  const newDifficulty = adjustDifficulty({
    previousTimeStamps: getLast16BlockTimeStamps({blocks}),
    currentTimeStamp,
    currentDifficulty: state.difficulty
  })
  blocks.push(state)
  const miningRewardBody = JSON.stringify({
    writer: keyPair.publicKey,
    message: 'minerReward'
  })
  const transactionSignature = keys.sign({message: miningRewardBody, privateKey: keyPair.privateKey})
  blockToBeConfirmed = {
    previousHash: hash,
    nonce,
    difficulty: newDifficulty,
    transactions: [{
      body: miningRewardBody,
      signature: transactionSignature
    }],
    merkleRoot: null,
    number: blocks.length,
    timeStamp: currentTimeStamp
  }
}

const be = () => {
  if(!keyPair.publicKey) return
  if(!keyPair.privateKey) return

  merklinateTransactions({transactions: blockToBeConfirmed.transactions}).then(merkleRoot => {
    blockToBeConfirmed.merkleRoot = merkleRoot
    blockToBeConfirmed.nonce = Math.floor(Math.random() * 1000000)
    const hashOfBlock = hashBlockState({
      state: blockStateToCanonicalArray({state: omit(blockToBeConfirmed, 'transactions')}),
      nonce: blockToBeConfirmed.nonce
    })

    const blockHashAsInt = parseInt(hashOfBlock, 16)
    const difficultyAsInt = parseInt(blockToBeConfirmed.difficulty, 16)

    if(blockHashAsInt > difficultyAsInt) {
      publishBlockFound({state: blockToBeConfirmed, hash: hashOfBlock})
    }
  })
}

communication.listenForOthers().then(() => {
  return communication.joinPeers()
}).then(() => {
  setInterval(be, 16)
})

const readlineActual = readline.createInterface({input: process.stdin, output: process.stdout})
const doQuestion = () => {
  readlineActual.question('command away: ', command => {
    command = command.toString()
    if(command === 'blocks') {
      console.log(blocks)
    } else if(command.startsWith('block')) {
      console.log(blocks[command.split(' ')[1]])
    } else if(command.startsWith('transaction')) {
      command = command.split(' ')
      const message = command[1]
      const body = JSON.stringify({
        writer: keyPair.publicKey,
        message
      })
      blockToBeConfirmed.transactions.push({
        body,
        signature: keys.sign({body, privateKey: keyPair.privateKey})
      })
    } else if(command.startsWith('generateKeyPair')) {
      const keyPair = keys.generateKeyPair()
      console.log('publicKey: ' + keyPair.publicKey)
      console.log('privateKey: ' + keyPair.privateKey)
    } else if(command.startsWith('setPublicKey')) {
      keyPair.publicKey = command.split(' ')[1]
    } else if(command.startsWith('setPrivateKey')) {
      keyPair.privateKey = command.split(' ')[1]
    } else if(command.startsWith('help')) {
      const commands = ['blocks', 'block <number>', 'transaction <message> <privateKey>', 'generateKeyPair', 'setPublicKey <publicKey>', 'setPrivateKey <privateKey>']
      commands.forEach(a => console.log(a))
    }
    doQuestion()
  })
}

doQuestion()
