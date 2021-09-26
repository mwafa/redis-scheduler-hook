require("dotenv").config()
const { listenSchedule } = require("./src/scheduler")
const server = require("./src/server")

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server run on port ${port}`)
  listenSchedule()
})
