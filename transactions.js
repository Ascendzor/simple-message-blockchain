const merklinator = require('merkle-tree-gen')
const keys = require('./keys')

module.exports = {
  generateMerkleRoot: ({transactions}) => {
    return new Promise((resolve, reject) => {
      return merklinator.fromArray({array: transactions}, (err, tree) => {
        if(err) reject(err)
        resolve(tree.root)
      })
    })
  },
  createRewardTransaction: ({publicKey, privateKey}) => {
    const body = JSON.stringify({
      publicKey,
      type: 'reward'
    })
    const signature = keys.sign({message: body, privateKey})
    return {body, signature}
  },
  createWriteTransaction: ({message, publicKey, privateKey}) => {
    const body = JSON.stringify({publicKey, message, type: 'write'})
    return {
      body,
      signature: keys.sign({message: body, privateKey})
    }
  },
  verify: ({transactions}) => {
    const invalidTransactions = transactions.filter(t => {
      const response = !keys.verify({
        message: t.body,
        signature: t.signature,
        publicKey: JSON.parse(t.body).publicKey
      })
      return response
    })
    if(invalidTransactions.length > 0) return {invalidTransactions}
    return true
  }
}
