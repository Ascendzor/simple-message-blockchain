let state = {
  transactionsToBeConfirmed: [],
  blocks: [],
  keyPair: {}
}

module.exports = {
  setState: ({newState}) => {
    state = newState
  },
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
  addUnconfirmedTransaction: ({transaction}) => {

  }
}
