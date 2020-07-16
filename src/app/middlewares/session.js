function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect('/users/login')
    
    return next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId)
        return res.redirect('/users')
    
    return next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}