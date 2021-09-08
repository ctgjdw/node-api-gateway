// All gateway routes
const ROUTES = [
    {
        url: '/api/**/auth/**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/auth/**',
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
            onProxyReq: relayRequestHeaders,
        },
    },
    {
        url: '/api/**/user/**',
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
    '/api/**/auth/forget-password**',
    '/api/auth/**',
    '/api/**/user/register',
]

// Send claims info for downstream services to retrieve
function relayRequestHeaders(proxyReq, req, res) {
    if (req.jwt) {
        const { userId, userType, roleId } = req.jwt

        proxyReq.setHeader('UserId', userId)
        proxyReq.setHeader('UserType', userType)
        proxyReq.setHeader('UserRoleId', roleId)
    }
}

module.exports = { ROUTES, PUBLIC_ROUTES }
