const axios = require('axios')
const { PUBLIC_ROUTES } = require('./routes')
const authUrl = process.env.AUTH_TOKEN_URL
const { matchPattern } = require('url-matcher')

// setup middle wares for each route
async function setupAuth(app, routes) {
    routes.forEach((r) => {
        app.use(r.url, verifyAccessToken, (req, res, next) => next())
    })
}

async function verifyAccessToken(req, res, next) {
    console.log(`Process auth for ${req.baseUrl}`)

    // skip auth as route is public
    if (req.baseUrl) {
        for (let r of PUBLIC_ROUTES) {
            if (matchPattern(r, req.baseUrl)) {
                next()
                return
            }
        }
    }

    // verify access token
    try {
        const claimsJson = await axios.get(authUrl, {
            headers: {
                Authorization: req.headers.authorization,
            },
        })

        if (claimsJson) {
            addCookies(res, claimsJson)
            next()
        }
    } catch (err) {
        let resp = {
            date: new Date().toISOString(),
            statusCode: 401,
            resource: req.baseUrl,
            message: 'Unauthorized. Please use a valid Bearer Token.',
        }

        return res.status(401).json(resp)
    }
}

// After the end of the proxy, adds cookies containing JWT claims
function addCookies(res, claimsJson) {
    for (let [key, val] of Object.entries(claimsJson.data)) {
        res.cookie(key, val, { httpOnly: true })
    }
}

module.exports = setupAuth
