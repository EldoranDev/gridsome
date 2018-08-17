const http = require('http')
const sockjs = require('sockjs')
const portfinder = require('portfinder')

module.exports = clients => new Promise(async resolve => {
  portfinder.basePort = 9000

  const port = await portfinder.getPortPromise()
  const echo = sockjs.createServer({ log: () => null })
  const server = http.createServer()
  const prefix = '/echo'

  echo.on('connection', connection => {
    clients[connection.id] = connection

    connection.on('close', () => {
      delete clients[connection.id]
    })
  })

  echo.installHandlers(server, { prefix })

  server.listen(port, () => {
    resolve(`http://localhost:${port}${prefix}`)
  })
})