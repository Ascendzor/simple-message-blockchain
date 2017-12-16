module.exports = {
  getAccountDetails: ({blocks, publicKey}) => {
    const coins = blocks.reduce((sum, block) => {
      if(sum === undefined) sum = 0
      const rewardTransaction = block.transactions.findIndex(t => {
        const body = JSON.parse(t.body)
        return body.type === 'reward' && body.publicKey === publicKey
      })
      if(rewardTransaction === -1) return sum
      return sum+1
    }, 0)

    return {
      publicKey,
      coins,
      messages: []
    }
  }
}
