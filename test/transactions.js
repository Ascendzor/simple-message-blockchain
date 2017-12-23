const transactions = require('../transactions')
const testState = require('./testState')

const keyPair = testState.validKeyPair
const rewardTransaction = transactions.createRewardTransaction({publicKey: keyPair.publicKey, privateKey: keyPair.privateKey})
const response = transactions.verify({transactions: [rewardTransaction]})
if(response.invalidTransactions) throw 'correct transaction shouldve verified'

const badKeyPair = testState.invalidKeyPair
const badRewardTransaction = transactions.createRewardTransaction({publicKey: badKeyPair.publicKey, privateKey: badKeyPair.privateKey})
const badResponse = transactions.verify({transactions: [badRewardTransaction]})
if(!badResponse.invalidTransactions) throw 'invalid transaction should have invalided'

const writeTransaction = transactions.createWriteTransaction({
  message: 'this is a test message',
  publicKey: keyPair.publicKey,
  privateKey: keyPair.privateKey
})
const writeResponse = transactions.verify({transactions: [writeTransaction]})
if(writeResponse.invalidTransactions) throw 'valid write transaction should have verified'

const badWriteTransaction = transactions.createWriteTransaction({
  message: 'this is a test message',
  publicKey: badKeyPair.publicKey,
  privateKey: badKeyPair.privateKey
})
const badWriteResponse = transactions.verify({transactions: [badWriteTransaction]})
if(!badWriteResponse.invalidTransactions) throw 'invalid write transaction should have returned with invalidTransactions'

console.log('all passed')
