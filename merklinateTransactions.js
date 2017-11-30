const merklinator = require('merkle-tree-gen')

module.exports = ({transactions}) => {
  return new Promise((resolve, reject) => {
    return merklinator.fromArray({array: transactions}, (err, tree) => {
      if(err) reject(err)
      resolve(tree.root)
    })
  })
}
