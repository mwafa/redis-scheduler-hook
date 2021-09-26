const { default: axios } = require("axios")

const executor = (body) => {
  const { method, url, body: data, headers } = body
  console.log(`${method} : ${url}`)
  return axios({
    url,
    data,
    method,
    headers,
  })
}

module.exports = executor
