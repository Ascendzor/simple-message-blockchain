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
    const signature = keys.sign({message: body, privateKey: privateKey})
    return {body, signature}
  },
  createWriteTransaction: () => {

  }
}
