const app = require('express')()
const fetch = require('node-fetch-extra')

app.all('/', (req, res) => {
  const url = decodeURIComponent(req.query.url.toString())

  res.setHeader(
    'content-type',
    `image/${url.includes('.png') ? 'png' : 'jpg'}` // Oh well
  )
  fetch(url).then(async (response) => {
    await response.body.pipe(res)
  })
})

module.exports = app
