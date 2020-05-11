exports.onlySeller = (req, res, next)=>{
    if(!req.session.isSeller){
        return res.status(401).redirect('/login?loginMessage=blocked')
    }
    return next()

}