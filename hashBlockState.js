const SHA256 = require("crypto-js/sha256")

module.exports = ({state}) => {
  let stringy = JSON.stringify(state)
  let theHash = SHA256(stringy)
  let words = theHash.words
  let buffer = new Buffer(theHash.words)
  let hexString = buffer.toString('hex')
  return hexString
}
