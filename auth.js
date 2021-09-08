const axios = require('axios')
const { PUBLIC_ROUTES } = require('./routes')
const authUrl = process.env.AUTH_TOKEN_URL
const { matchPattern } = require('url-matcher')

// setup auth middle wares for each route
async function setupAuth(app, routes) {
    routes.forEach((r) => {
        app.use(r.url, verifyAccessToken, (req, res, next) => next())
    })
}

// calls auth server's verify access token method.
async function verifyAccessToken(req, res, next) {
    console.log(`Process auth for ${req.baseUrl}`)

    // skip auth if route is public
    if (req.baseUrl) {
        for (let r of PUBLIC_ROUTES) {
            if (matchPattern(r, req.baseUrl)) {
                next()
                return
            }
        }
    }

    // call verify access token, return 401 if error
    try {
        const claimsJson = await axios.get(authUrl, {
            headers: {
                Authorization: req.headers.authorization,
            },
        })

        if (claimsJson) {
            addCookies(req, res, claimsJson)
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

// After the end of the proxy, adds cookies containing JWT claims for browser to interact with
function addCookies(req, res, claimsJson) {
    for (let [key, val] of Object.entries(claimsJson.data)) {
        res.cookie(key, val, { httpOnly: true, secure: true })
    }

    // pass jwt claims to next middleware using req
    req.jwt = claimsJson.data
}

module.exports = setupAuth
