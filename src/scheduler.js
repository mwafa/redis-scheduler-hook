const Redis = require("ioredis")
const { v4 } = require("uuid")
const executor = require("./executor")
const logger = require("./utils/logger")

const port = process.env.REDIS_PORT || 6379
const host = process.env.REDIS_HOST || "localhost"

const client = new Redis(port, host)
const key = "TASK"

const delay = (n) =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve(1), n)
  })

const listenSchedule = async (interval = 1000) => {
  logger(`Listen Schedule every ${interval}ms `)
  while (true) {
    const now = new Date().getTime()
    const [item, score] = await client.zrange(key, 0, 0, "WITHSCORES")
    if (parseInt(score) < now) {
      if (await client.zrem(key, item)) {
        const { uuid, body } = JSON.parse(item)
        logger("RUN :", uuid)
        executor(body)
          .then(({ data }) => {
            logger("RES :", uuid)
            logger(data)
          })
          .catch((e) => {
            logger("ERR :", uuid)
            if (e.response) logger(e.response.data)
          })
        continue
      }
    }
    await delay(interval)
  }
}

const addSchedule = async (time, body) => {
  const uuid = v4()
  const data = JSON.stringify({ uuid, body })

  const output = await client.zadd(key, time, data)
  logger("NEW :", uuid, "at", new Date(time).toISOString())

  return [uuid, output]
}

module.exports = { listenSchedule, addSchedule, delay }
