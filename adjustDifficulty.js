const targetTime = 1000 * 60 //10 seconds
module.exports = ({previousTimeStamps, currentTimeStamp, currentDifficulty}) => {
  const averageTimeForBlocks = (previousTimeStamps.reduce((a,b) => a+b, 0) / previousTimeStamps.length)
  const timeDifference = currentTimeStamp - averageTimeForBlocks
  const shouldIncreaseDifficulty = timeDifference < targetTime
  const maxDifficulty = parseInt('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)
  let difficultyChangeAmount = (maxDifficulty - parseInt(currentDifficulty, 16)) * 0.005
  if(!shouldIncreaseDifficulty) difficultyChangeAmount *= -1
  const newDifficulty = parseInt(currentDifficulty, 16) + difficultyChangeAmount
  const difficulty = newDifficulty.toString(16)
  return difficulty
}
