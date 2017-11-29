const order = {
  previousHash: 0,
  merkleRoot: 1,
  difficulty: 2,
  transactions: 3
}

module.exports = ({state}) => {
  let keysInOrder = Object.keys(state).map(key => key)
  keysInOrder = keysInOrder.sort((a, b) => order[a] > order[b])

  let blockStateAsCanonicalArray = []
  keysInOrder.forEach(key => {
    blockStateAsCanonicalArray.push(state[key])
  })
  return blockStateAsCanonicalArray
}
