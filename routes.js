// All gateway routes
const ROUTES = [
    {
        url: '/api/**/auth**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/auth**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/**/user**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/**/admin**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/upload**',
        proxy: {
            target: 'http://localhost:8081',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/**/org**',
        proxy: {
            target: 'http://localhost:8082',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/ap/role**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/ap/partner**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
]

// All public routes for gateway. Works as a whitelist against the auth check.
const PUBLIC_ROUTES = [
    '/api/**/auth/login',
    '/api/**/auth/signed-cookies',
    '/api/**/auth/forget-password**',
    '/api/auth/**',
    '/api/**/user/register',
    '/upload/image/profile-pic',
    '/api/mp/user/verify',
    '/mp/verify-acc**',
    '/api/ap/partner/register',
    '/upload/docs/ap/biz-docs'
]

// Send claims info for downstream services to retrieve
function relayRequestHeaders(proxyReq, req, res) {
    if (req.jwt) {
        for (key in req.jwt) {
            proxyReq.setHeader(key, req.jwt[key])
        }
    }
}

module.exports = { ROUTES, PUBLIC_ROUTES }
