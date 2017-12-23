const readline = require('readline')
const state = require('./state')
const transactions = require('./transactions')
const blockChainExplorer = require('./blockChainExplorer')

module.exports = () => {
  const readlineActual = readline.createInterface({input: process.stdin, output: process.stdout})
  const doQuestion = () => {
    readlineActual.question('command away: ', command => {
      command = command.toString()
      console.log(command)
      if(command === 'blocks') {
        console.log(state.blocks())
      } else if(command.startsWith('block')) {
        console.log(state.blocks()[command.split(' ')[1]])
      } else if(command.startsWith('writeMessage')) {
        //writeMessage 'something' 042511bb916b3a335125bd3ffd4c8725f9ae8bba5d131148f0c3da10031cea5ab98854fbb4f23f0af0f764450f59efff6744c9e5362ee35461e2e8ff168943cf50 89dde6ac9065a5954340cf04f61ca9c402e80c74ce20c03547d6008e38cd5be0
        const message = command.split('\'')[1]
        command = command.split('\'')[0] + command.split('\'')[2]
        command = command.split(' ')
        const publicKey = command[2]
        const privateKey = command[3]
        const transaction = transactions.createWriteTransaction({message, publicKey, privateKey})
        state.addUnconfirmedTransaction({transaction})
      } else if(command.startsWith('generateKeyPair')) {
        const keyPair = keys.generateKeyPair()
        console.log('publicKey: ' + keyPair.publicKey)
        console.log('privateKey: ' + keyPair.privateKey)
      } else if(command.startsWith('setPublicKey')) {
        state.setKeyPair({publicKey: command.split(' ')[1]})
      } else if(command.startsWith('setPrivateKey')) {
        state.setKeyPair({privateKey: command.split(' ')[1]})
      } else if(command.startsWith('help')) {
        const commands = [
          'blocks',
          'block <number>',
          'transaction <message> <privateKey>',
          'generateKeyPair',
          'setPublicKey <publicKey>',
          'setPrivateKey <privateKey>',
          'viewAccount <publicKey>'
        ]
        commands.forEach(a => console.log(a))
      } else if(command.startsWith('viewAccount')) {
        const account = blockChainExplorer.getAccountDetails({blocks: state.blocks(), publicKey: command.split(' ')[1]})
        console.log(account)
      }
      doQuestion()
    })
  }

  doQuestion()
}
