const { default: axios } = require("axios")
const logger = require("./utils/logger")

const executor = (body) => {
  const { method, url, body: data, headers } = body
  logger(`${method} : ${url}`)
  return axios({
    url,
    data,
    method,
    headers,
  })
}

module.exports = executor
