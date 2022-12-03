const { expressjwt: jwt } = require('express-jwt');


const isAuthenticated = jwt(
    {
        secret: process.env.TOKEN_SECRET,
        algorithms: ["HS256"],
        requestProperty: 'payload',
        getToken: getTokenFromHeaders
    }

);

// function to get jwt token from the request's Authorization headers

function getTokenFromHeaders(req) {

    //see if token is available on the request headers

    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        // get encoded token and return it

        const token = req.headers.authorization.split(" ")[1];
        return token;
    }
    return null;
}

module.exports = {
    isAuthenticated
}