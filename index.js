require("dotenv").config()
const { listenSchedule } = require("./src/scheduler")
const server = require("./src/server")
const logger = require("./src/utils/logger")

const port = process.env.PORT || 3000
const interval = process.env.INTERVAL || 3000

server.listen(port, () => {
  logger(`Server run on port ${port}`)
  listenSchedule(interval)
})
