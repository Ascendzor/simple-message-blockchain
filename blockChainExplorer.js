const uniq = require('lodash/uniq')
const getAccountDetails = ({blocks, publicKey}) => {
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

module.exports = {
  getAccountDetails,
  getAllMessages: ({blocks}) => {
    let writes = []
    blocks.forEach(block => {
      block.transactions.forEach(transaction => {
        const body = JSON.parse(transaction.body)
        if(body.type === 'write') writes.push({publicKey: body.publicKey, message: body.message})
      })
    })

    return writes
  },
  wouldOverSpend: ({blocks, transactions}) => {
    transactions = transactions.filter(t => JSON.parse(t.body).type === 'write')
    let publicKeys = transactions.map(t => JSON.parse(t.body).publicKey)
    publicKeys = uniq(publicKeys)

    let someoneIsOverSpending = false
    publicKeys.forEach(p => {
      let writeCount = transactions.filter(t => JSON.parse(t.body).type === 'write' && JSON.parse(t.body).publicKey === p).length
      let accountDetails = getAccountDetails({blocks, publicKey: p})

      if(accountDetails.currentCoins < writeCount) someoneIsOverSpending = true
    })

    return someoneIsOverSpending
  }
}
