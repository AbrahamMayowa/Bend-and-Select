const Goods = require('../models/goods')

exports.goodsLists = (req, res, next) => {
    Goods.find()
    .then(goods => {
        res.render('general/homePage', {
            allGoods: goods,
            pageTitle: 'Home'
        })
    })
    .catch(error => console.log(error))
}


exports.productDetails = (req, res, next)=> {
    const getId =  req.params.productId

    let userSession = null
    if(req.user){
        userSession = req.user._id
    }

    let checkWishlist = null
    Goods.findById(getId)
    .then(goods =>{
        if(req.user && !req.session.isSeller){

            // it return true or false
            checkWishlist = req.user.checkWishlist(goods._id)

        }
        //check the user has review the product before. return true or false

        const checkReview = goods.checkReview(req.user._id)
        console.log(checkReview)
        res.render('general/productDetails', {
            pageTitle: 'Product',
            productDetails: goods,
            requestUser: userSession,
            wishlist: checkWishlist,
            productId: goods._id,
            checkReview: checkReview
        })
    })
    .catch(error => next(error))

}
