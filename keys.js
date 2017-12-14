const elliptic = require('elliptic').ec
const secp256k1 = elliptic('secp256k1')
const hash = require('hash.js')
const convertHex = require('convert-hex')

module.exports = {
  generateKeyPair: () => {
    const thing = secp256k1.genKeyPair()
    return {
      privateKey: thing.getPrivate('hex'),
      publicKey: thing.getPublic('hex')
    }
  },
  sign: ({message, privateKey}) => {
    let key = secp256k1.keyFromPrivate(privateKey, 'hex')
    return convertHex.bytesToHex(secp256k1.sign(message, key, 'hex').toDER())
  },
  verify: ({message, signature, publicKey}) => {
    let key = secp256k1.keyFromPublic(publicKey, 'hex')
    return key.verify(message, signature)
  },
  getPublicKey: ({privateKey}) => {
    return secp256k1.keyFromPrivate(privateKey, 'hex').getPublic()
  }
}
