require('dotenv').config()

const express = require('express')
const port = process.env.PORT
const morgan = require('morgan')
const setupProxyRoutes = require('./reverseProxy')
const setupAuth = require('./auth')
const { ROUTES } = require('./routes')
const cors = require('cors');

// setup app
const app = express()

// Setup CORS
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Setup request logging
app.use(morgan('combined'))

// Setup auth checks
setupAuth(app, ROUTES)

// Setup request proxy and routing
setupProxyRoutes(app, ROUTES)

app.listen(port, () => console.log(`gateway-node listening on port ${port}!`))
