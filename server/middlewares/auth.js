const jwt = require('jsonwebtoken')
function auth(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        req.user = decode
        next()
    } catch (err) {
        res.status(400).send('Invalid token..');
    }
}
module.exports = auth;
