exports.onlyAuthentcatedUser = (req, res, next) =>{
    if(!req.session.isAuthenticated){
        return res.status(401).redirect('/401')
    }

    return next()
}
