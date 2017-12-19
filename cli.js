const readline = require('readline')
const state = require('./state')
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
      } else if(command.startsWith('transaction')) {
        command = command.split(' ')
        const message = command[1]
        const body = JSON.stringify({
          publicKey: state.keyPair().publicKey,
          message
        })
        blockToBeConfirmed.transactions.push({
          body,
          signature: keys.sign({body, privateKey: state.keyPair().privateKey})
        })
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
        const account = blockChainExplorer.getAccountDetails({publicKey: command.split(' ')[1]})
        console.log(account)
      }
      doQuestion()
    })
  }

  doQuestion()
}
