const logger = (...msg) => {
  const now = new Date().toISOString()
  return console.log(now, "-", ...msg)
}
module.exports = logger
