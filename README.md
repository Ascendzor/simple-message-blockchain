# simple-message-blockchain v0.1.0

# Purpose
To create a client in javascript of a message-blockchain for experimental and educational purposes. Once version 1 is released and there are a few clients running in the mesh these strings that are written into the blockchain will never be deleted, that's the idea anyway. This project is not intended to be useful, but instead to demonstrate the capabilities of a decentralized additive datastore.

# What it is
Decentralized string store with accountability.

Reward: The block to be discovered includes a transaction with "reward" and a public address that is therefore awarded one "messageCoin"

Proof of work: sha256, vulnerable to ASICs I know, enhance your calm, this is a chill project that's intended to be simple.

Difficulty: targeting 60 seconds, adjusts every block based on previous block time

max block size: none yet, but blocks aren't being streamed so the first bottleneck will probably be socketio event size restrictions I'm guessing?

transactions (see transactions section, at the bottom of this readme)

# Progress (until v1 assume nothing has been implemented correctly)
- [x] ~~let people create public&private keys~~
- [x] ~~let people sign transactions~~
- [x] ~~define block format~~ (will likely change as this project makes progress towards 1.0.0)
- [x] ~~PoW (sha256 for simplicity)~~
- [x] ~~difficulty adjustment~~ (formula here https://github.com/Ascendzor/simple-message-blockchain/blob/master/adjustDifficulty.js)
- [x] ~~earn messageCoin~~
- [ ] write message
- [ ] join peers
- [ ] verify blocks (almost! https://github.com/Ascendzor/simple-message-blockchain/blob/master/blocks.js)
- [ ] broadcast transactions
- [ ] persist blockchain onto fs
- [ ] include peers transactions into local block discovery
- [ ] handle accidental forks (block solve race condition)
- [ ] trade messageCoin

# Dependencies

node 6.10.3

# How to run:

`npm i`

`node be`

# CLI commands

'blocks' -> prints a list of the blocks as your node sees them

'block {number}' -> prints the details of the specific block

'transaction {message} {privateKey}' -> creates a transaction to write a message into the blockchain, using your private key to sign the transaction

'generateKeyPair' -> prints newly generated publicKey & privateKey as hex

(likely to be changed in the near future) 'setPublicKey {publicKey}' -> sets publicKey to be used for block reward

(likely to be changed in the near future) 'setPrivateKey {privateKey}' -> sets privateKey to be used for block reward

'viewAccount' -> prints all details about an account, takes a publicKey. publicKey should be seen as public unique account identifiers.

# Transactions

There will likely end up being three types of transactions

reward, message, trade

reward rewards the block discoverer with one "messageCoin". reward needs a publicKey and good block.

message will let a user write a message into the blockchain, at the cost of one "messageCoin". message needs a publicKey, messageString, and a signature of the messageString using the privateKey that is associated with the publicKey.

trade will let a user trade messageCoin to other users. trade will require an amount, a fromPublicKey, a toPublicKey, and a signature of all of the above using the privateKey that is connected with the fromPublicKey. trade will be invalidated if the fromPublicKey does not have as much messageCoin as it is trying to trade

# What next?

Block format specification and block verification is the key to creating your own blockchain rules. See https://github.com/Ascendzor/simple-message-blockchain/blob/master/blocks.js for how blocks are specified and verified in this chain.

blockchains are protocols, not code. This is simply the first client for this type of blockchain, if you'd like to contribute to this simple-message-blockchain in your favourite language then go forth and create your own simple-message-blockchain in golang, python, ruby, C#, etc and join the simple-message-blockchain.
