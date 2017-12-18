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
const transactions = require('./transactions')
const blockChainExplorer = require('./blockChainExplorer')
const state = require('./state')

state.setKeyPair({
  privateKey: '89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0',
  publicKey: '042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50'
})

const rewardTransaction = transactions.createRewardTransaction({
  publicKey: state.keyPair().publicKey,
  privateKey: state.keyPair().privateKey
})

let genesisBlockState = {
  previousHash: null,
  merkleRoot: null,
  difficulty: 0x000000ffffffffff,
  transactions: [rewardTransaction],
  nonce: null,
  number: 0,
  timeStamp: +moment.utc()
}

let blockState = blockStateToCanonicalArray({blockState: genesisBlockState})
let blockToBeConfirmed = genesisBlockState

state.addBlock({block: genesisBlockState})

const getLast16BlockTimeStamps = () => {
  return state.blocks().filter((block, key) => ((key+16) > state.blocks().length)).map(b => b.timeStamp)
}

const publishBlockFound = ({blockState, hash, nonce}) => {
  const previousBlock = last(state.blocks())
  const currentTimeStamp = +moment.utc()
  const newDifficulty = adjustDifficulty({
    previousTimeStamps: getLast16BlockTimeStamps(),
    currentTimeStamp,
    currentDifficulty: blockState.difficulty
  })

  state.addBlock({block: blockState})

  const rewardTransaction = transactions.createRewardTransaction({
    publicKey: state.keyPair().publicKey,
    privateKey: state.keyPair().privateKey
  })

  blockToBeConfirmed = {
    previousHash: hash,
    nonce,
    difficulty: newDifficulty,
    transactions: [rewardTransaction],
    merkleRoot: null,
    number: state.blocks().length,
    timeStamp: currentTimeStamp
  }
}

const be = () => {
  if(!state.keyPair().publicKey) return
  if(!state.keyPair().privateKey) return

  merklinateTransactions({transactions: blockToBeConfirmed.transactions}).then(merkleRoot => {
    blockToBeConfirmed.merkleRoot = merkleRoot
    blockToBeConfirmed.nonce = Math.floor(Math.random() * 1000000)
    const hashOfBlock = hashBlockState({
      state: blockStateToCanonicalArray({blockState: omit(blockToBeConfirmed, 'transactions')}),
      nonce: blockToBeConfirmed.nonce
    })

    const blockHashAsInt = parseInt(hashOfBlock, 16)
    const difficultyAsInt = parseInt(blockToBeConfirmed.difficulty, 16)

    if(blockHashAsInt > difficultyAsInt) {
      publishBlockFound({blockState: blockToBeConfirmed, hash: hashOfBlock})
    }
  }).catch(err => console.log(err))
}

communication.listenForOthers().then(() => {
  return communication.joinPeers()
}).then(() => {
  setInterval(be, 16)
}).catch(err => console.log(err))

const readlineActual = readline.createInterface({input: process.stdin, output: process.stdout})
const doQuestion = () => {
  readlineActual.question('command away: ', command => {
    command = command.toString()
    console.log(command)
    if(command === 'blocks') {
      console.log(state.blocks())
    } else if(command.startsWith('block')) {
      console.log(state.blocks()[command.split(' ')[1]])
    } else if(command.startsWith('transaction')) {
      command = command.split(' ')
      const message = command[1]
      const body = JSON.stringify({
        publicKey: state.keyPair().publicKey,
        message
      })
      blockToBeConfirmed.transactions.push({
        body,
        signature: keys.sign({body, privateKey: state.keyPair().privateKey})
      })
    } else if(command.startsWith('generateKeyPair')) {
      const keyPair = keys.generateKeyPair()
      console.log('publicKey: ' + keyPair.publicKey)
      console.log('privateKey: ' + keyPair.privateKey)
    } else if(command.startsWith('setPublicKey')) {
      state.setKeyPair({publicKey: command.split(' ')[1]})
    } else if(command.startsWith('setPrivateKey')) {
      state.setKeyPair({privateKey: command.split(' ')[1]})
    } else if(command.startsWith('help')) {
      const commands = [
        'blocks',
        'block <number>',
        'transaction <message> <privateKey>',
        'generateKeyPair',
        'setPublicKey <publicKey>',
        'setPrivateKey <privateKey>',
        'viewAccount <publicKey>'
      ]
      commands.forEach(a => console.log(a))
    } else if(command.startsWith('viewAccount')) {
      const account = blockChainExplorer.getAccountDetails({publicKey: command.split(' ')[1]})
      console.log(account)
    }
    doQuestion()
  })
}

doQuestion()
