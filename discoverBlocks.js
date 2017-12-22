const omit = require('lodash/omit')
const blocks = require('./blocks')
const transactions = require('./transactions')

let highestHash = 0

module.exports = ({blockToBeDiscovered, onBlockDiscovered}) => {
  transactions.generateMerkleRoot({transactions: blockToBeDiscovered.transactions}).then(merkleRoot => {
    blockToBeDiscovered.merkleRoot = merkleRoot
    blockToBeDiscovered.nonce = Math.floor(Math.random() * 1000000)
    const hash = blocks.hashBlock({blockToBeHashed: blockToBeDiscovered})
    const blockHashAsInt = parseInt(hash, 16)
    const difficultyAsInt = parseInt(blockToBeDiscovered.difficulty, 16)

    if(parseInt(highestHash, 16) < parseInt(hash, 16)) highestHash = hash

    if(blockHashAsInt > difficultyAsInt) {
      blockToBeDiscovered.hash = hash
      onBlockDiscovered({blockState: blockToBeDiscovered})
    }
  }).catch(err => console.log(err))
}
