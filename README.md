# simple-message-blockchain

Work in progress.

##Purpose
To create a client in javascript of a message-blockchain for experimental and educational purposes.

##Progress
* ~~let people create public&private keys~~
* ~~let people sign transactions~~
* ~~define block format~~ (will likely change as this project makes progress towards 1.0.0)
* ~~PoW (sha256 for simplicity)~~
* difficulty adjustment
* join peers
* verify blocks from peers
* broadcast transactions
* include peers transactions into local block discovery
* handle accidental forks (block solve race condition)

##Dependencies

node 6.10.3

##How to run:

`npm i`
`node networkNode`

##CLI commands

'blocks' -> prints a list of the blocks as your node sees them

'block {number}' -> prints the details of the specific block

'transaction {message} {privateKey}' -> creates a transaction to write a message into the blockchain, using your private key to sign the transaction
  
'generateKeyPair' -> prints newly generated publicKey & privateKey as hex

(likely to be changed in the near future) 'setPublicKey {publicKey}' -> sets publicKey to be used for block reward

(likely to be changed in the near future) 'setPrivateKey {privateKey}' -> sets privateKey to be used for block reward
