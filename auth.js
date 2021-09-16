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
        console.log(`Apply auth for ${req.baseUrl}`)
        const claimsJson = await axios.get(authUrl, {
            headers: {
                Authorization: req.headers.authorization,
            },
        })

        if (claimsJson) {
            passClaimsData(req, res, claimsJson)
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
function passClaimsData(req, res, claimsJson) {
    // pass jwt claims to next middleware using req
    const { userId, userType, userRoleId, userRole } = claimsJson.data
    req.jwt = {userId, userType, userRoleId, userRole }
}

module.exports = setupAuth
