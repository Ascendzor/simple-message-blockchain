const SHA256 = require("crypto-js/sha256")

module.exports = ({state}) => {
  return (new Buffer(SHA256(JSON.stringify(state)).words)).toString('hex')
}
