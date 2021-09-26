const Express = require("express")
const { addSchedule } = require("./scheduler")

const server = Express()

server.use(Express.json())

server.use("/add/:time(\\d+)", async (req, res) => {
  const { method, body, query } = req
  const { url, headers } = query
  const time = parseInt(req.params.time)

  if (time && url) {
    const [uuid, output] = await addSchedule(time, {
      method,
      body,
      url,
      headers,
    })
    return res.json({ method, body, headers, query, uuid, output })
  }
  return res.status(400).json({ error: true, message: "Invalid Input" })
})

server.use("*", (_, res) => {
  res.status(404).json({ error: true, message: "Not Found!" })
})

module.exports = server
