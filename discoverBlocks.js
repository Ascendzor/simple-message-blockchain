const merklinateTransactions = require('./merklinateTransactions')
const omit = require('lodash/omit')
const hashBlockState = require('./hashBlockState')
const blockStateToCanonicalArray = require('./blockStateToCanonicalArray')

module.exports = ({blockToBeDiscovered, onBlockDiscovered}) => {
  merklinateTransactions({transactions: blockToBeDiscovered.transactions}).then(merkleRoot => {
    blockToBeDiscovered.merkleRoot = merkleRoot
    blockToBeDiscovered.nonce = Math.floor(Math.random() * 1000000)
    const hash = hashBlockState({
      state: blockStateToCanonicalArray({blockState: omit(blockToBeDiscovered, 'transactions')}),
      nonce: blockToBeDiscovered.nonce
    })

    const blockHashAsInt = parseInt(hash, 16)
    const difficultyAsInt = parseInt(blockToBeDiscovered.difficulty, 16)

    if(blockHashAsInt > difficultyAsInt) {
      blockToBeDiscovered.hash = hash
      onBlockDiscovered({blockState: blockToBeDiscovered})
    }
  }).catch(err => console.log(err))
}
