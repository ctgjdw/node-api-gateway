const ROUTES = [
    {
        url: '/api/mp/auth/**',
        // To implement
        // rateLimit: {
        //     windowMs: 15 * 60 * 1000,
        //     max: 5,
        // },
        proxy: {
            target: 'http://localhost:8080',
            changeOrigin: false,
        },
    },
]

const PUBLIC_ROUTES = ['/api/**/auth/login']

module.exports = { ROUTES, PUBLIC_ROUTES }
