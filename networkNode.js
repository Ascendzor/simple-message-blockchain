const communication = require('./communication')
const blockStateToCanonicalArray = require('./blockStateToCanonicalArray')
const hashBlockState = require('./hashBlockState')
const merklinateTransactions = require('./merklinateTransactions')

let genesisBlockState = {
  previousHash: null,
  merkleRoot: null,
  difficulty: 'ffffffffffffffff',
  transactions: null,
  nonce: null,
  number: 0
}

let blockState = blockStateToCanonicalArray({state: genesisBlockState})
let blockToBeConfirmed = genesisBlockState

let blocks = []
let memPool = []

const publishBlockFound = ({state, previousHash, nonce}) => {
  blocks.push(state)
  let transactions = [{
    from: 'the big bang',
    to: 'someones public address'
  }]
  merklinateTransactions({transactions}).then(merkleRoot => {
    blockToBeConfirmed = {
      previousHash,
      nonce,
      difficulty: 'ffffffffffffffff',
      transactions,
      merkleRoot,
      number: blocks.length-1
    }
  })
}
console.log(blockToBeConfirmed)

const be = () => {
  const nonce = Math.floor(Math.random() * 1000000)
  const hashOfBlock = hashBlockState({
    state: blockStateToCanonicalArray({state: blockToBeConfirmed}),
    nonce
  })
  console.log('hash of block: ' + hashOfBlock)

  if(hashOfBlock < blockToBeConfirmed.difficulty) {
    publishBlockFound({
      state: blockToBeConfirmed,
      prevHash: hashOfBlock,
      nonce
    })
  } else {
    console.log('didnt find a solution')
  }
}

communication.listenForOthers().then(() => {
  return communication.joinPeers()
}).then(() => {
  setInterval(be, 2000)
})
