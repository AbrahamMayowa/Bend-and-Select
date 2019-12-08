exports.onlySeller = (req, res, next)=>{
    if(!req.session.isSeller){
        res.status(401).redirect('/401')
    }
}


