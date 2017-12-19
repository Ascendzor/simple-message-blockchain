const last = require('lodash/last')
const transactions = require('./transactions')
const adjustDifficulty = require('./adjustDifficulty')
const blockTimesToBeTakenIntoConsiderationWhenCalculatingDifficulty = 16

module.exports = ({blocks, now, privateKey, publicKey}) => {
  const lastBlock = last(blocks)
  const rewardTransaction = transactions.createRewardTransaction({
    publicKey,
    privateKey
  })

  const newDifficulty = adjustDifficulty({
    previousTimeStamps: blocks
      .filter((block, key) => ((key+blockTimesToBeTakenIntoConsiderationWhenCalculatingDifficulty) > blocks.length))
      .map(b => b.timeStamp),
    currentTimeStamp: now,
    currentDifficulty: lastBlock.difficulty
  })

  return {
    previousHash: lastBlock ? lastBlock.hash : null,
    nonce: lastBlock.nonce,
    difficulty: newDifficulty,
    transactions: [rewardTransaction],
    merkleRoot: null,
    number: blocks.length,
    timeStamp: now
  }
}
