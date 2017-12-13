function handleErr (err) {
  console.log(err)
}

function genId () {
  const newBaseChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const newBase = newBaseChars.length
  let result = []
  for (let i = 0; i < 6; i++) {
    result.push(newBaseChars[Math.floor(Math.random() * newBase)])
  }
  return result.join('')
}

module.exports.handleErr = handleErr
module.exports.genId = genId
