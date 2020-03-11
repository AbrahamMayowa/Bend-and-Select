exports.onlySeller = (req, res, next)=>{
    if(!req.session.isSeller){
        return res.status(401).redirect('/login?loginMessage=You must login as a seller')
    }
    return next()

}