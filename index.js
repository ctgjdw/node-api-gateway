require('dotenv').config()

const express = require('express')
const port = process.env.PORT
const morgan = require('morgan')
const setupProxyRoutes = require('./reverseProxy')
const setupAuth = require('./auth')
const { ROUTES } = require('./routes')

// setup app
const app = express()

// Setup middle wares
app.use(morgan('combined'))
setupAuth(app, ROUTES)
setupProxyRoutes(app, ROUTES)

app.listen(port, () => console.log(`gateway-node listening on port ${port}!`))
