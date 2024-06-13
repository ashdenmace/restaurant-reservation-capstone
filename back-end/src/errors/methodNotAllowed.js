function methodNotAllowed(req, res, next) {
    next({
        status: 405,
        messsage: `${req.method} method is not allowed for ${req.originalUrl}`
    })
}

module.exports = methodNotAllowed;