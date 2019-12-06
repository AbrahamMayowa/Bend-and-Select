exports.onlyAuthentcatedUser = (req, res, next) =>{
    if(!req.session.isAuthenticated){
        req.flash('LogInPlease', 'Please login to access the requested page')
        return res.redirect('/')
    }else{
        next()
    }
}
