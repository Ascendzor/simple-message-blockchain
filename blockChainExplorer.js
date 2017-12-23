module.exports = {
  getAccountDetails: ({blocks, publicKey}) => {
    let totalRewards = 0
    let writes = []

    blocks.forEach(block => {
      block.transactions.forEach(transaction => {
        const body = JSON.parse(transaction.body)
        if(body.type === 'reward' && body.publicKey === publicKey) totalRewards++
        if(body.type === 'write' && body.publicKey === publicKey) writes.push(body.message)
      })
    })

    return {
      publicKey,
      totalRewards,
      totalWrites: writes.length,
      currentCoins: totalRewards-writes.length,
      writes
    }
  }
}
