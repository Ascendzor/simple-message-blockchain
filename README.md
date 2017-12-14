# simple-message-blockchain v0.1.0

# Purpose
To create a client in javascript of a message-blockchain for experimental and educational purposes.

# What it is
Decentralized string store with accountability.

transactions have "writer", "message", and "signature". The "writer" is the public key for signature verification. "message" is the string to be stored. "signature" is signature generated from writer privateKey.

Reward: Protocol is the block to be discovered includes a transaction with "miningReward" and a public address that is therefore awarded one "messageCoin"

Proof of work: sha256, vulnerable to ASICs I know, enhance your calm, this is a chill project meant for experimenting things like having the network be attacked just to see what happens.

Difficulty: targeting 30seconds, adjusts every block based on previous block time

max block size: none yet, but blocks aren't being streamed so the first bottleneck will probably be socketio event size restrictions I'm guessing?

# Progress (until v1 assume nothing has been implemented correctly)
- [x] ~~let people create public&private keys~~
- [x] ~~let people sign transactions~~
- [x] ~~define block format~~ (will likely change as this project makes progress towards 1.0.0)
- [x] ~~PoW (sha256 for simplicity)~~
- [ ] difficulty adjustment
- [ ] earn messageCoin
- [ ] join peers
- [ ] verify blocks
- [ ] broadcast transactions
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
