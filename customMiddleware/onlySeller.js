exports.onlySeller = (req, res, next)=>{
    if(!req.session.isSeller){
        return res.status(401).redirect('/401')
    }
    return next()

}


