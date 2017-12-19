let state = {
  transactionsToBeConfirmed: [],
  blocks: [],
  keyPair: {}
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

  }
}
