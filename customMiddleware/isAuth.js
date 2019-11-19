exports.onlyAuthentcatedUser = (req, res, next) =>{
    if(!req.session.isAuthenticate){
        req.flash('LogInPlease', 'Please login to access the requested page')
        res.redirect('/')
    }else{
        next()
    }
}
