exports.error404 = (req, res, next) =>{
    res.status(404).render('error/404', {
        pageTitle: 'Error 404'
    })
}


exports.error401 = (req, res, next) =>{
    res.status(401).render('error/401',{
        pageTitle: 'Error 401'
    })
}