const { createProxyMiddleware } = require('http-proxy-middleware')

function setupProxyRoutes(app, routes) {
    routes.forEach((r) => {
        r.proxy.onProxyReq = app.use(r.url, createProxyMiddleware(r.proxy))
    })
}

module.exports = setupProxyRoutes
