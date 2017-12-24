const without = require('lodash/without')
const transactions = require('./transactions')

let state = {
  transactionsToBeConfirmed: [],
  blocks: [],
  keyPair: {},
  shouldMine: false
}

module.exports = {
  setKeyPair: ({publicKey, privateKey}) => {
    if(!publicKey && privateKey) state.keyPair.privateKey = privateKey
    if(!privateKey && publicKey) state.keyPair.publicKey = publicKey
    if(privateKey && publicKey) state.keyPair = {privateKey, publicKey}
  },
  keyPair: () => {
    return state.keyPair
  },
  getState: () => {
    return state
  },
  addBlock: ({block}) => {
    state.blocks.push(block)
  },
  blocks: () => {
    return state.blocks
  },
  addUnconfirmedTransaction: ({transaction}) => {
    state.transactionsToBeConfirmed.push(transaction)
  },
  removeUnconfirmedTransactions: ({transactions}) => {
    state.transactionsToBeConfirmed = without(state.transactionsToBeConfirmed, ...transactions)
  },
  getUnconfirmedTransactions: () => {
    return state.transactionsToBeConfirmed
  },
  setShouldMine: (wellThen) => {
    state.shouldMine = wellThen
  },
  getShouldMine: () => state.shouldMine
}
