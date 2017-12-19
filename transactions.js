const keys = require('./keys')
module.exports = {
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
