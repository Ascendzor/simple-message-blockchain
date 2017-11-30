const communication = require('./communication')
const blockStateToCanonicalArray = require('./blockStateToCanonicalArray')
const hashBlockState = require('./hashBlockState')
const merklinateTransactions = require('./merklinateTransactions')
const _ = require('lodash')

let genesisBlockState = {
  previousHash: null,
  merkleRoot: null,
  difficulty: 'ffffffffffffffff',
  transactions: [{
    from: 'the big bang',
    to: 'someones public address'
  }],
  nonce: null,
  number: 0
}

let blockState = blockStateToCanonicalArray({state: genesisBlockState})
let blockToBeConfirmed = genesisBlockState

let blocks = []
let memPool = []

const publishBlockFound = ({state, hash, nonce}) => {
  blocks.push(state)
  blockToBeConfirmed = {
    previousHash: hash,
    nonce,
    difficulty: 'ffffffffffffffff',
    transactions: [{
      from: 'the big bang',
      to: 'someones public address'
    }],
    merkleRoot: null,
    number: blocks.length-1
  }
}

const be = () => {
  merklinateTransactions({transactions: blockToBeConfirmed.transactions}).then(merkleRoot => {
    blockToBeConfirmed.merkleRoot = merkleRoot
    blockToBeConfirmed.nonce = Math.floor(Math.random() * 1000000)
    const hashOfBlock = hashBlockState({
      state: blockStateToCanonicalArray({state: _.omit(blockToBeConfirmed, 'transactions')}),
      nonce: blockToBeConfirmed.nonce
    })

    if(hashOfBlock < blockToBeConfirmed.difficulty) {
      console.log('=============================')
      console.log(blocks)
      publishBlockFound({state: blockToBeConfirmed, hash: hashOfBlock})
    } else {
      console.log('didnt find a solution')
    }
  })
}

communication.listenForOthers().then(() => {
  return communication.joinPeers()
}).then(() => {
  setInterval(be, 2000)
})
