const Redis = require("ioredis")
const { v4 } = require("uuid")
const executor = require("./executor")

const port = process.env.REDIS_PORT || 6379
const host = process.env.REDIS_HOST || "localhost"

const client = new Redis(port, host)
const key = "TASK"

const delay = (n) =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve(1), n)
  })

const listenSchedule = async (interval = 1000) => {
  console.log(`Listen Schedule every ${interval}ms `)
  while (true) {
    const now = new Date().getTime()
    const [item, score] = await client.zrange(key, 0, 0, "WITHSCORES")
    if (parseInt(score) < now) {
      if (await client.zrem(key, item)) {
        const { uuid, body } = JSON.parse(item)
        console.log("RUN :", uuid)
        executor(body)
          .then(({ data }) => {
            console.log("RES :", uuid)
            console.log(data)
          })
          .catch((e) => {
            console.log("ERR :", uuid)
            if (e.response) console.log(e.response.data)
          })
      }
    }
    await delay(interval)
  }
}

const addSchedule = async (time, body) => {
  const uuid = v4()
  const data = JSON.stringify({ uuid, body })

  const output = await client.zadd(key, time, data)

  return [uuid, output]
}

module.exports = { listenSchedule, addSchedule, delay }
