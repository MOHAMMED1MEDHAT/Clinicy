const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');
const jwtSecret = config.get('env_var.jwtScreteKey');

function auth() {
    return expressJwt({
        secret: jwtSecret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
        '/api/user/signUp',
        '/api/user/login'
        ]
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
        console.log('isRevoked');
    }
    done();
}

module.exports = auth;
