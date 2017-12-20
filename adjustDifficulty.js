const targetTime = 1000 * 60 //60 seconds
module.exports = ({previousTimeStamps, currentTimeStamp, currentDifficulty}) => {
  // console.log(previousTimeStamps)
  const averageTimeForBlocks = (previousTimeStamps.reduce((a,b) => a+b, 0) / previousTimeStamps.length)
  const timeDifference = currentTimeStamp - averageTimeForBlocks
  const shouldIncreaseDifficulty = timeDifference < targetTime
  const maxDifficulty = parseInt('ffffffffffffffff', 16)
  let difficultyChangeAmount = (maxDifficulty - parseInt(currentDifficulty, 16)) * 0.01
  if(!shouldIncreaseDifficulty) difficultyChangeAmount *= -1
  const newDifficulty = parseInt(currentDifficulty, 16) + difficultyChangeAmount
  const difficulty = newDifficulty.toString(16)
  return difficulty
}
