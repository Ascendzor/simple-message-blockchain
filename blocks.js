const last = require('lodash/last')
const transactions = require('./transactions')
const adjustDifficulty = require('./adjustDifficulty')
const blockTimesToBeTakenIntoConsiderationWhenCalculatingDifficulty = 16
const moment = require('moment')
const SHA256 = require("crypto-js/sha256")
const blockChainExplorer = require('./blockChainExplorer')

const hashBlock = ({blockToBeHashed}) => {
  const toBeHashed = blockToBeHashed.previousHash + blockToBeHashed.merkleRoot + blockToBeHashed.difficulty + blockToBeHashed.number + blockToBeHashed.timeStamp + blockToBeHashed.nonce
  return SHA256(toBeHashed).toString()
}

module.exports = {
  hashBlock,
  createGenesisBlock: ({publicKey, privateKey, now}) => {
    const rewardTransaction = transactions.createRewardTransaction({
      publicKey,
      privateKey
    })

    return {
      hash: null,
      previousHash: null,
      merkleRoot: null,
      difficulty: 'fe8a87e6fbc78800000000000000000000000000000000000000000000000000', //to find the default difficulty I started at 0, let the difficulty adjust for 1000 blocks then used that. Something like that anyway, this is a good start point
      transactions: [rewardTransaction],
      nonce: null,
      number: 0,
      timeStamp: now
    }
  },
  createNextBlockFrame: ({blocks, now, privateKey, publicKey}) => {
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
      hash: null,
      previousHash: lastBlock ? lastBlock.hash : null,
      nonce: lastBlock.nonce,
      difficulty: newDifficulty,
      transactions: [rewardTransaction],
      merkleRoot: null,
      number: blocks.length,
      timeStamp: now
    }
  },
  verifyBlock: ({blocks, blockToBeVerified}) => {
    const lastBlock = last(blocks)
    if(!lastBlock) return true //genesis check
    if(blockToBeVerified.previousHash != lastBlock.hash) return {err: 'invalid previousHash'}
    if(blockToBeVerified.number != lastBlock.number+1) return {err: 'invalid number'}
    if(blockToBeVerified.timeStamp < lastBlock.timeStamp) return {err: 'invalid timeStamp'}
    if(hashBlock({blockToBeHashed: blockToBeVerified}) != blockToBeVerified.hash) return {err: 'invalid hash'}
    if(transactions.verify({transactions: blockToBeVerified.transactions}).invalidTransactions) return {err: 'invalid transactions'}
    if(blockChainExplorer.wouldOverSpend({blocks, transactions: blockToBeVerified.transactions})) return {err: 'someone tried to spend more than they had'}
    if(blockToBeVerified.transactions.filter(t => JSON.parse(t.body).type === 'reward').length > 1) return {err: 'someone tried to claim more than 1 reward'}

    return {good: true}
  }
}
