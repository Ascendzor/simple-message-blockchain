const targetTime = 1000 * 10 //10 seconds
module.exports = ({previousTimeStamp, newTimeStamp, currentDifficulty}) => {
  const timeForBlock = newTimeStamp - previousTimeStamp
  console.log('currentDifficulty', currentDifficulty)
  console.log('timeForBlock', timeForBlock)
  console.log('targetTime', targetTime)
  return currentDifficulty * (targetTime/timeForBlock)
}
