# simple-message-blockchain v0.1.0

# Purpose
To create a client in javascript of a message-blockchain for experimental and educational purposes.

# What it is
Decentralized string store with accountability.

Reward: Protocol is the block to be discovered includes a transaction with "miningReward" and a public address that is therefore awarded one "messageCoin"

Proof of work: sha256, vulnerable to ASICs I know, enhance your calm, this is a chill project meant for experimenting things like having the network be attacked just to see what happens.

Difficulty: targeting 30seconds, adjusts every block based on previous block time

max block size: none yet, but blocks aren't being streamed so the first bottleneck will probably be socketio event size restrictions I'm guessing?

transactions (see transactions section, at the bottom of this readme)

# Progress (until v1 assume nothing has been implemented correctly)
- [x] ~~let people create public&private keys~~
- [x] ~~let people sign transactions~~
- [x] ~~define block format~~ (will likely change as this project makes progress towards 1.0.0)
- [x] ~~PoW (sha256 for simplicity)~~
- [ ] difficulty adjustment
- [ ] earn messageCoin
- [ ] write message
- [ ] join peers
- [ ] verify blocks
- [ ] broadcast transactions
- [ ] persist blockchain onto fs
- [ ] include peers transactions into local block discovery
- [ ] handle accidental forks (block solve race condition)
- [ ] trade messageCoin

# Dependencies

node 6.10.3

# How to run:

`npm i`

`node networkNode`

# CLI commands

'blocks' -> prints a list of the blocks as your node sees them

'block {number}' -> prints the details of the specific block

'transaction {message} {privateKey}' -> creates a transaction to write a message into the blockchain, using your private key to sign the transaction
  
'generateKeyPair' -> prints newly generated publicKey & privateKey as hex

(likely to be changed in the near future) 'setPublicKey {publicKey}' -> sets publicKey to be used for block reward

(likely to be changed in the near future) 'setPrivateKey {privateKey}' -> sets privateKey to be used for block reward

# Transactions

There will likely end up being three types of transactions

miningReward, message, trade

miningReward rewards the block discoverer with one "messageCoin". miningReward needs a publicKey and good block.

message will let a user write a message into the blockchain, at the cost of one "messageCoin". message needs a publicKey, messageString, and a signature of the messageString using the privateKey that is associated with the publicKey.

trade will let a user trade messageCoin to other users. trade will require an amount, a fromPublicKey, a toPublicKey, and a signature of all of the above using the privateKey that is connected with the fromPublicKey. trade will be invalidated if the fromPublicKey does not have as much messageCoin as it is trying to trade
